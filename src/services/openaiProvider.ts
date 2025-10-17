import OpenAI from "openai";
import { AIProvider, Note, ProcessedNote } from "./aiProvider";

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
    const basePrompt = `Analyze these ${subject} notes and create a structured summary.`;

    const subjectSpecificPrompts = {
      Math: `${basePrompt} Focus on mathematical concepts, formulas, and problem-solving steps. Identify any missing steps or unclear explanations.`,
      History: `${basePrompt} Focus on chronological events, cause-effect relationships, and historical context. Create timelines where relevant.`,
      Science: `${basePrompt} Focus on scientific concepts, processes, and relationships between phenomena. Identify any missing explanations or connections.`,
      General: `${basePrompt} Focus on main themes, key concepts, and logical organization. Identify knowledge gaps and areas needing clarification.`,
    };

    return `${
      subjectSpecificPrompts[subject as keyof typeof subjectSpecificPrompts] ||
      subjectSpecificPrompts.General
    }\n\nNotes:\n${content}\n\nProvide:\n1. A structured summary\n2. Key connections between concepts\n3. Knowledge gaps that need attention\n4. Suggested questions for deeper understanding`;
  }

  private parseResponse(response: string): ProcessedNote {
    // Simple parsing - in a real app, you'd want more robust parsing
    const lines = response.split("\n").filter((line) => line.trim().length > 0);

    return {
      structuredContent: response,
      connections: lines.filter(
        (line) => line.includes("connection") || line.includes("relates") || line.includes("links")
      ),
      gaps: lines.filter(
        (line) => line.includes("gap") || line.includes("missing") || line.includes("unclear")
      ),
      suggestions: lines.filter(
        (line) => line.includes("suggest") || line.includes("consider") || line.includes("question")
      ),
    };
  }
}
