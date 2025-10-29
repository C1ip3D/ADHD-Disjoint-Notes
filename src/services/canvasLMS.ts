export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  enrollment_term_id?: number;
  enrollments?: Array<{
    type: string;
    computed_current_score?: number;
    computed_current_grade?: string;
  }>;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at: string | null;
  points_possible: number;
  course_id: number;
  html_url: string;
  submission_types: string[];
  has_submitted_submissions?: boolean;
}

export interface CanvasSubmission {
  id: number;
  assignment_id: number;
  user_id: number;
  submitted_at: string | null;
  grade: string | null;
  score: number | null;
  workflow_state: "submitted" | "unsubmitted" | "graded" | "pending_review";
  late: boolean;
  missing: boolean;
}

export interface CanvasCourseGrade {
  course_id: number;
  course_name: string;
  course_code: string;
  current_score: number | null;
  current_grade: string | null;
  final_score: number | null;
  final_grade: string | null;
}

export interface CanvasAssignmentWithSubmission extends CanvasAssignment {
  submission?: CanvasSubmission;
  course_name?: string;
  course_code?: string;
}

export interface CanvasError {
  message: string;
  status?: number;
}

const ML_API_URL = import.meta.env.VITE_ML_API_URL || "http://localhost:5001";

export class CanvasLMSService {
  private baseUrl: string;
  private accessToken: string;

  constructor(canvasUrl: string, accessToken: string) {
    // Ensure URL has proper format
    this.baseUrl = canvasUrl.trim();
    if (
      !this.baseUrl.startsWith("http://") &&
      !this.baseUrl.startsWith("https://")
    ) {
      this.baseUrl = `https://${this.baseUrl}`;
    }
    // Remove trailing slash
    this.baseUrl = this.baseUrl.replace(/\/$/, "");
    this.accessToken = accessToken.trim();
  }

  /**
   * Make a proxied request to Canvas API via our backend to avoid CORS
   */
  private async proxyRequest(endpoint: string): Promise<any> {
    try {
      console.log(`[Canvas] Making proxy request to: ${endpoint}`);
      console.log(`[Canvas] ML API URL: ${ML_API_URL}`);
      console.log(`[Canvas] Canvas base URL: ${this.baseUrl}`);

      const response = await fetch(`${ML_API_URL}/canvas/proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canvasUrl: this.baseUrl,
          accessToken: this.accessToken,
          endpoint: endpoint,
        }),
      });

      console.log(`[Canvas] Proxy response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Canvas] Proxy request failed:`, errorText);
        throw new Error(
          `Proxy server error: ${response.status} ${response.statusText}. Is the Flask backend running on ${ML_API_URL}?`
        );
      }

      const result = await response.json();
      console.log(`[Canvas] Proxy result:`, result);

      if (!result.ok) {
        console.error(`[Canvas] Canvas API returned error:`, result);
        if (result.status === 401) {
          throw new Error(
            "Invalid Canvas access token. Please check your token and try again."
          );
        } else if (result.status === 404) {
          throw new Error(
            "Canvas URL not found. Please verify your institution's Canvas URL."
          );
        } else {
          throw new Error(
            `Canvas API error: ${result.status} ${
              result.error || "Unknown error"
            }`
          );
        }
      }

      console.log(`[Canvas] Successfully fetched data from Canvas`);
      return result.data;
    } catch (error: any) {
      console.error(`[Canvas] Error in proxyRequest:`, error);
      if (error.message) {
        throw error;
      }
      throw new Error(
        "Failed to connect to Canvas. Please check your internet connection and ensure the Flask backend is running."
      );
    }
  }

  /**
   * Fetch all active courses for the authenticated user
   */
  async fetchCourses(): Promise<CanvasCourse[]> {
    try {
      const courses: CanvasCourse[] = await this.proxyRequest(
        "/api/v1/courses?enrollment_state=active&per_page=100"
      );

      // Filter out courses where user is not a student or doesn't have access
      const activeCourses = courses.filter((course) => {
        return course.name && course.name.trim() !== "";
      });

      return activeCourses;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error(
        "Failed to connect to Canvas. Please check your internet connection."
      );
    }
  }

  /**
   * Validate Canvas credentials by attempting to fetch user profile
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.proxyRequest("/api/v1/users/self/profile");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fetch all assignments for a specific course
   */
  async fetchAssignments(courseId: number): Promise<CanvasAssignment[]> {
    try {
      const assignments: CanvasAssignment[] = await this.proxyRequest(
        `/api/v1/courses/${courseId}/assignments?per_page=100`
      );
      return assignments;
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  }

  /**
   * Fetch assignments with submissions for a specific course
   */
  async fetchAssignmentsWithSubmissions(
    courseId: number
  ): Promise<CanvasAssignmentWithSubmission[]> {
    try {
      const assignments: CanvasAssignmentWithSubmission[] =
        await this.proxyRequest(
          `/api/v1/courses/${courseId}/assignments?include[]=submission&per_page=100`
        );
      return assignments;
    } catch (error: any) {
      console.error("Error fetching assignments with submissions:", error);
      throw error;
    }
  }

  /**
   * Fetch course grades for the authenticated user
   */
  async fetchCourseGrades(): Promise<CanvasCourseGrade[]> {
    try {
      const courses: CanvasCourse[] = await this.proxyRequest(
        "/api/v1/courses?enrollment_state=active&include[]=total_scores&per_page=100"
      );

      // Extract grade information from enrollments
      const grades: CanvasCourseGrade[] = courses
        .map((course) => {
          const enrollment = course.enrollments?.[0];
          return {
            course_id: course.id,
            course_name: course.name,
            course_code: course.course_code,
            current_score: enrollment?.computed_current_score ?? null,
            current_grade: enrollment?.computed_current_grade ?? null,
            final_score: null,
            final_grade: null,
          };
        })
        .filter((grade) => grade.current_score !== null);

      return grades;
    } catch (error: any) {
      console.error("Error fetching course grades:", error);
      throw error;
    }
  }

  /**
   * Fetch upcoming assignments (due in next 7 days) across all courses
   */
  async fetchUpcomingAssignments(): Promise<CanvasAssignmentWithSubmission[]> {
    try {
      const courses = await this.fetchCourses();
      const now = new Date();
      const sevenDaysFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const allAssignments: CanvasAssignmentWithSubmission[] = [];

      // Fetch assignments for each course
      for (const course of courses) {
        try {
          const assignments = await this.fetchAssignmentsWithSubmissions(
            course.id
          );

          // Filter for upcoming assignments and add course info
          const upcomingAssignments = assignments
            .filter((assignment) => {
              if (!assignment.due_at) return false;
              const dueDate = new Date(assignment.due_at);
              return dueDate >= now && dueDate <= sevenDaysFromNow;
            })
            .map((assignment) => ({
              ...assignment,
              course_name: course.name,
              course_code: course.course_code,
            }));

          allAssignments.push(...upcomingAssignments);
        } catch (error) {
          console.error(
            `Error fetching assignments for course ${course.id}:`,
            error
          );
          // Continue with other courses even if one fails
        }
      }

      // Sort by due date
      allAssignments.sort((a, b) => {
        if (!a.due_at || !b.due_at) return 0;
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      });

      return allAssignments;
    } catch (error: any) {
      console.error("Error fetching upcoming assignments:", error);
      throw error;
    }
  }

  /**
   * Fetch all assignments across all courses with submissions
   */
  async fetchAllAssignments(): Promise<CanvasAssignmentWithSubmission[]> {
    try {
      const courses = await this.fetchCourses();
      const allAssignments: CanvasAssignmentWithSubmission[] = [];

      for (const course of courses) {
        try {
          const assignments = await this.fetchAssignmentsWithSubmissions(
            course.id
          );

          const assignmentsWithCourse = assignments.map((assignment) => ({
            ...assignment,
            course_name: course.name,
            course_code: course.course_code,
          }));

          allAssignments.push(...assignmentsWithCourse);
        } catch (error) {
          console.error(
            `Error fetching assignments for course ${course.id}:`,
            error
          );
          // Continue with other courses
        }
      }

      // Sort by due date (most recent first)
      allAssignments.sort((a, b) => {
        if (!a.due_at && !b.due_at) return 0;
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        return new Date(b.due_at).getTime() - new Date(a.due_at).getTime();
      });

      return allAssignments;
    } catch (error: any) {
      console.error("Error fetching all assignments:", error);
      throw error;
    }
  }
}

/**
 * Helper function to create Canvas service instance
 */
export function createCanvasService(
  canvasUrl: string,
  accessToken: string
): CanvasLMSService {
  return new CanvasLMSService(canvasUrl, accessToken);
}
