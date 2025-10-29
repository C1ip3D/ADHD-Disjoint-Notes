/**
 * Secure AI Provider - All API calls go through backend
 * This ensures the OpenAI API key is NEVER exposed to the browser
 */

import type { Note, ProcessedNote, QuizQuestion } from "./aiProvider";

const ML_API_URL = import.meta.env.VITE_ML_API_URL || "http://localhost:5001";

export class SecureAIProvider {
  /**
   * Analyze notes using backend AI endpoint
   */
  async analyzeNotes(notes: Note[], subject: string): Promise<ProcessedNote> {
    const prompt = this.getSubjectPrompt(subject);

    try {
      const response = await fetch(`${ML_API_URL}/ai/analyze-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.map((n) => ({ content: n.content, subject: n.subject })),
          subject,
          promptTemplate: prompt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze notes");
      }

      const data = await response.json();
      const result = data.result || "";
      return this.parseResponse(result);
    } catch (error) {
      console.error("AI analysis error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze notes"
      );
    }
  }

  /**
   * Generate outline from notes
   */
  async generateOutline(notes: Note[], subject: string): Promise<string> {
    try {
      const response = await fetch(`${ML_API_URL}/ai/generate-outline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.map((n) => ({ content: n.content, subject: n.subject })),
          subject,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate outline");
      }

      const data = await response.json();
      return data.outline || "";
    } catch (error) {
      console.error("Outline generation error:", error);
      throw new Error("Failed to generate outline");
    }
  }

  /**
   * Find connections between concepts
   */
  async findConnections(notes: Note[]): Promise<string[]> {
    try {
      const response = await fetch(`${ML_API_URL}/ai/find-connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.map((n) => ({ content: n.content, subject: n.subject })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to find connections");
      }

      const data = await response.json();
      return data.connections || [];
    } catch (error) {
      console.error("Connection finding error:", error);
      throw new Error("Failed to find connections");
    }
  }

  /**
   * Chat with AI assistant
   */
  async chat(
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const response = await fetch(`${ML_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Chat failed");
      }

      const data = await response.json();
      return data.message || "";
    } catch (error) {
      console.error("Chat error:", error);
      throw new Error(error instanceof Error ? error.message : "Chat failed");
    }
  }

  /**
   * Generate flashcards from content
   */
  async generateFlashcards(content: string): Promise<string> {
    try {
      const response = await fetch(`${ML_API_URL}/ai/generate-flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Flashcard generation failed");
      }

      const data = await response.json();
      return data.flashcards || "";
    } catch (error) {
      console.error("Flashcard generation error:", error);
      throw new Error("Failed to generate flashcards");
    }
  }

  /**
   * Analyze image and extract text
   */
  async analyzeImage(imageUrl: string, promptText?: string): Promise<string> {
    try {
      const response = await fetch(`${ML_API_URL}/ai/analyze-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          promptText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Image analysis failed");
      }

      const data = await response.json();
      return data.text || "";
    } catch (error) {
      console.error("Image analysis error:", error);
      throw new Error("Failed to analyze image");
    }
  }

  /**
   * Get subject-specific prompt template
   */
  private getSubjectPrompt(subject: string): string {
    const isMathOrScience = subject === "Math" || subject === "Science";

    const basePrompt = `Analyze these {subject} notes and create a WELL-STRUCTURED, EASY-TO-READ summary.

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

    const subjectSpecificPrompts: Record<string, string> = {
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
      subjectSpecificPrompts[subject] || subjectSpecificPrompts.General
    }\n\n---\n\nNotes to analyze:\n{content}`;
  }

  /**
   * Parse AI response into structured data
   */
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

    return {
      structuredContent: response,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      connections: connections.length > 0 ? connections : [],
      gaps: gaps.length > 0 ? gaps : [],
      suggestions: suggestions.length > 0 ? suggestions : [],
      quizQuestions: quizQuestions.length > 0 ? quizQuestions : undefined,
    };
  }

  /**
   * Parse quiz questions from AI response
   */
  private parseQuizQuestions(response: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const lines = response
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let currentQuestion: Partial<QuizQuestion> | null = null;
    let options: string[] = [];
    let correctAnswerIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Check if this is a question
      if (
        /^\d+[\.)]\s/.test(line) ||
        (line.match(/^\d+\.\s/) && line.includes("?"))
      ) {
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
      // Check if this is an option
      else if (/^[A-Da-d][\.)]\s/.test(line) && currentQuestion) {
        const isCorrect =
          line.toUpperCase().includes("[CORRECT]") ||
          line.toLowerCase().includes("(correct)") ||
          line.toLowerCase().includes("**correct**") ||
          line.includes("✓") ||
          line.includes("✔");

        if (isCorrect) {
          correctAnswerIndex = options.length;
        }

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

    // Validate and clean up questions
    const validatedQuestions = questions
      .map((q) => {
        if (q.options.length < 2) return null;

        const uniqueOptions = Array.from(new Set(q.options));
        let newCorrectIndex = q.correctAnswer;

        if (uniqueOptions.length !== q.options.length) {
          const correctAnswerText =
            q.options[q.correctAnswer] || q.options[0] || "";
          newCorrectIndex = uniqueOptions.indexOf(correctAnswerText);
          if (newCorrectIndex === -1) {
            newCorrectIndex = 0;
          }
        }

        while (uniqueOptions.length < 4) {
          uniqueOptions.push(`Option ${uniqueOptions.length + 1}`);
        }

        return {
          question: q.question,
          options: uniqueOptions.slice(0, 4),
          correctAnswer:
            newCorrectIndex >= 0 && newCorrectIndex < 4 ? newCorrectIndex : 0,
        };
      })
      .filter((q): q is QuizQuestion => q !== null);

    return validatedQuestions;
  }
}

// Export singleton instance
export const secureAI = new SecureAIProvider();
