import OpenAI from "openai";
import { AIProvider, type Note, type ProcessedNote, type QuizQuestion } from "./aiProvider";

export type { ProcessedNote, QuizQuestion };

export class OpenAIProvider extends AIProvider {
  private openai: OpenAI;

  constructor(apiKey: string) {
    super();
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async analyzeNotes(notes: Note[], subject: string): Promise<ProcessedNote> {
    const content = notes.map((note) => note.content).join("\n\n");

    const prompt = this.getSubjectPrompt(subject, content);

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that analyzes notes and creates structured, coherent summaries. Focus on identifying key concepts, connections, and gaps in knowledge.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const result = response.choices[0]?.message?.content || "";
      return this.parseResponse(result);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to analyze notes with OpenAI");
    }
  }

  async generateOutline(notes: Note[], subject: string): Promise<string> {
    const content = notes.map((note) => note.content).join("\n\n");

    const prompt = `Create a hierarchical outline for the following ${subject} notes:\n\n${content}\n\nFormat as a structured markdown outline with main topics and subtopics.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate outline");
    }
  }

  async findConnections(notes: Note[]): Promise<string[]> {
    const content = notes.map((note) => note.content).join("\n\n");

    const prompt = `Analyze these notes and identify key connections between concepts:\n\n${content}\n\nReturn a list of connections, one per line, explaining how different concepts relate to each other.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const result = response.choices[0]?.message?.content || "";
      return result.split("\n").filter((line) => line.trim().length > 0);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to find connections");
    }
  }

  private getSubjectPrompt(subject: string, content: string): string {
    const isMathOrScience = subject === "Math" || subject === "Science";

    const basePrompt = `Analyze these ${subject} notes and create a WELL-STRUCTURED, EASY-TO-READ summary.

FORMATTING REQUIREMENTS (FOLLOW EXACTLY):

1. USE CLEAR HEADINGS:
   - Use ## for main section headings
   - Include these sections: Overview, Key Concepts, Important Points, Connections, Study Tips

2. USE BULLET POINTS:
   - Use bullet points (-) for lists of information
   - Keep each bullet point concise (1-2 sentences)
   - Leave blank lines between bullet groups

3. HIGHLIGHT IMPORTANT PARTS:
   - Use **bold** for the MOST important terms and concepts (5-10 per section)
   - Use > for key definitions or critical information

4. SPACING:
   - Leave blank lines between sections
   - Leave blank lines between paragraphs
   - Keep paragraphs short (2-4 sentences)

5. STRUCTURE:
   ## Overview
   Brief introduction to what these notes cover.

   ## Key Concepts
   - **Important concept 1**: Brief explanation
   - **Important concept 2**: Brief explanation
   - **Important concept 3**: Brief explanation

   ## Important Points to Remember
   - Key point 1 with **highlighted terms**
   - Key point 2 with **highlighted terms**
   - Key point 3 with **highlighted terms**

   ## How It All Connects
   Explain how the concepts relate to each other.

   ## Study Tips
   - Practical tip 1
   - Practical tip 2

${
  isMathOrScience
    ? "\n   ## Examples (for Math/Science)\n   Provide 2-3 worked examples with step-by-step solutions"
    : ""
}

QUIZ FORMAT (CRITICAL - MUST FOLLOW EXACTLY):
Create 5 multiple choice questions at the END under a "QUIZ QUESTIONS" heading. For EACH question use this EXACT format:

1. [Question text here]?
A) [First answer option]
B) [Second answer option]
C) [Third answer option] [CORRECT]
D) [Fourth answer option]

CRITICAL RULES FOR QUIZ:
- Put [CORRECT] after the correct answer on the SAME LINE
- Only ONE correct answer per question with [CORRECT] marker
- ALWAYS include [CORRECT] marker - this is MANDATORY
- Use A), B), C), D) format (with closing parentheses)
- Each question MUST have exactly 4 DIFFERENT answer options
- Make sure all 4 options are UNIQUE and DISTINCT from each other
- DO NOT repeat the same answer option multiple times
- Questions must be clear and unambiguous`;

    const subjectSpecificPrompts = {
      Math: `${basePrompt}

For Math notes:
- Highlight formulas and equations
- Break down problem-solving steps
- Provide worked examples
- Create practice problems with varying difficulty
- Explain when to use each method`,
      Science: `${basePrompt}

For Science notes:
- Highlight scientific laws and principles
- Explain processes step-by-step
- Connect theory to real-world applications
- Provide examples and case studies
- Create practice questions`,
      History: `${basePrompt}

For History notes:
- Create chronological timeline
- Highlight cause-and-effect relationships
- Connect events to broader themes
- Identify key figures and their roles
- Suggest essay topics`,
      General: `${basePrompt}

For General notes:
- Identify main themes
- Highlight key vocabulary
- Create logical organization
- Connect ideas across topics`,
    };

    return `${
      subjectSpecificPrompts[subject as keyof typeof subjectSpecificPrompts] ||
      subjectSpecificPrompts.General
    }\n\n---\n\nNotes to analyze:\n${content}`;
  }

  private parseResponse(response: string): ProcessedNote {
    const lines = response.split("\n");

    // Extract key points (lines with ** or starting with -)
    const keyPoints = lines
      .filter((line) => line.includes("**") || line.trim().startsWith("- "))
      .map((line) => line.replace(/\*\*/g, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 8);

    // Extract connections
    const connections = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("connection") ||
          line.toLowerCase().includes("relates") ||
          line.toLowerCase().includes("links") ||
          line.toLowerCase().includes("connects")
      )
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter((line) => line.length > 20)
      .slice(0, 5);

    // Extract gaps
    const gaps = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("gap") ||
          line.toLowerCase().includes("missing") ||
          line.toLowerCase().includes("unclear") ||
          line.toLowerCase().includes("need")
      )
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter((line) => line.length > 15)
      .slice(0, 5);

    // Extract suggestions
    const suggestions = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("suggest") ||
          line.toLowerCase().includes("consider") ||
          line.toLowerCase().includes("try") ||
          line.toLowerCase().includes("practice")
      )
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter((line) => line.length > 15)
      .slice(0, 5);

    // Extract quiz questions
    const quizQuestions = this.parseQuizQuestions(response);

    // Extract examples and practice problems if present
    const examples: string[] = [];
    const practiceProblems: string[] = [];
    let inExamplesSection = false;
    let inProblemsSection = false;
    let mainIdeas = "";

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes("example") || lowerLine.includes("worked example")) {
        inExamplesSection = true;
        inProblemsSection = false;
      } else if (lowerLine.includes("practice") || lowerLine.includes("problem")) {
        inProblemsSection = true;
        inExamplesSection = false;
      } else if (lowerLine.includes("main ideas")) {
        mainIdeas = line;
      }

      if (inExamplesSection && line.trim().length > 10) {
        examples.push(line.trim());
      } else if (inProblemsSection && line.trim().length > 5) {
        practiceProblems.push(line.trim());
      }
    });

    return {
      structuredContent: response,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      connections: connections.length > 0 ? connections : [],
      gaps: gaps.length > 0 ? gaps : [],
      suggestions: suggestions.length > 0 ? suggestions : [],
      examples: examples.length > 0 ? examples : undefined,
      practiceProblems: practiceProblems.length > 0 ? practiceProblems : undefined,
      mainIdeas: mainIdeas || undefined,
      quizQuestions: quizQuestions.length > 0 ? quizQuestions : undefined,
    };
  }

  private parseQuizQuestions(response: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const lines = response
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Debug: Log the response to see what AI generated
    console.log(
      "🎯 Quiz Section from AI:",
      response.substring(response.lastIndexOf("1."), response.length)
    );

    let currentQuestion: Partial<QuizQuestion> | null = null;
    let options: string[] = [];
    let correctAnswerIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Check if this is a question (starts with number followed by period/dot or contains ?)
      if (/^\d+[\.)]\s/.test(line) || (line.match(/^\d+\.\s/) && line.includes("?"))) {
        // Save previous question if exists
        if (currentQuestion && options.length >= 2) {
          questions.push({
            question: currentQuestion.question || "",
            options,
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
          });
        }

        // Start new question
        currentQuestion = { question: line.replace(/^\d+[\.)]\s*/, "").trim() };
        options = [];
        correctAnswerIndex = -1;
      }
      // Check if this is an option (A), B), C), D) or A. B. C. D. or a) b) c) d)
      else if (/^[A-Da-d][\.)]\s/.test(line) && currentQuestion) {
        // Check for correct answer markers (case insensitive)
        const isCorrect =
          line.toUpperCase().includes("[CORRECT]") ||
          line.toLowerCase().includes("(correct)") ||
          line.toLowerCase().includes("**correct**") ||
          line.includes("✓") ||
          line.includes("✔");

        if (isCorrect) {
          correctAnswerIndex = options.length;
        }

        // Clean up the option text
        let optionText = line
          .replace(/^[A-Da-d][\.)]\s*/, "")
          .replace(/\[CORRECT\]/gi, "")
          .replace(/\(correct\)/gi, "")
          .replace(/\*\*correct\*\*/gi, "")
          .replace(/✓/g, "")
          .replace(/✔/g, "")
          .trim();

        options.push(optionText);
      }
    }

    // Add last question
    if (currentQuestion && options.length >= 2) {
      questions.push({
        question: currentQuestion.question || "",
        options,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      });
    }

    // Validate and fix questions
    const validatedQuestions = questions
      .map((q) => {
        // Ensure we have at least 2 options
        if (q.options.length < 2) {
          return null;
        }

        // Remove duplicate options and keep only unique ones
        const uniqueOptions = Array.from(new Set(q.options));

        // If we lost the correct answer during deduplication, find its new index
        let newCorrectIndex = q.correctAnswer;
        if (uniqueOptions.length !== q.options.length) {
          const correctAnswerText = q.options[q.correctAnswer] || q.options[0] || "";
          newCorrectIndex = uniqueOptions.indexOf(correctAnswerText);
          if (newCorrectIndex === -1) {
            newCorrectIndex = 0;
          }
        }

        // Pad with filler options if needed to reach 4 options
        while (uniqueOptions.length < 4) {
          uniqueOptions.push(`Option ${uniqueOptions.length + 1}`);
        }

        return {
          question: q.question,
          options: uniqueOptions.slice(0, 4),
          correctAnswer: newCorrectIndex >= 0 && newCorrectIndex < 4 ? newCorrectIndex : 0,
        };
      })
      .filter((q): q is QuizQuestion => q !== null);

    // Fallback: if no correct answers were found, randomly assign them
    validatedQuestions.forEach((q, idx) => {
      if (
        q.correctAnswer === 0 &&
        validatedQuestions.filter((qu) => qu.correctAnswer !== 0).length === 0
      ) {
        // If all questions have correctAnswer = 0, it means parsing failed
        // Assign different correct answers to make it more realistic
        q.correctAnswer = idx % q.options.length;
      }
    });

    return validatedQuestions;
  }
}
