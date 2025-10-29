export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  enrollment_term_id?: number;
  enrollments?: Array<{ type: string }>;
}

export interface CanvasError {
  message: string;
  status?: number;
}

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
   * Fetch all active courses for the authenticated user
   */
  async fetchCourses(): Promise<CanvasCourse[]> {
    try {
      const url = `${this.baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Invalid Canvas access token. Please check your token and try again."
          );
        } else if (response.status === 404) {
          throw new Error(
            "Canvas URL not found. Please verify your institution's Canvas URL."
          );
        } else {
          throw new Error(
            `Canvas API error: ${response.status} ${response.statusText}`
          );
        }
      }

      const courses: CanvasCourse[] = await response.json();

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
      const url = `${this.baseUrl}/api/v1/users/self/profile`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      return false;
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
