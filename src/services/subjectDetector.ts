import { OpenAIProvider } from "./openaiProvider";

export interface SubjectDetectionResult {
  detectedSubject: string;
  confidence: number;
  alternativeSubjects: string[];
  reasoning: string;
}

export class SubjectDetector {
  private aiProvider: OpenAIProvider | null = null;

  constructor(openaiApiKey?: string) {
    if (openaiApiKey) {
      this.aiProvider = new OpenAIProvider(openaiApiKey);
    }
  }

  async detectSubject(content: string): Promise<SubjectDetectionResult> {
    if (!this.aiProvider) {
      return this.fallbackDetection(content);
    }

    try {
      const prompt = this.getSubjectDetectionPrompt(content);
      const response = await this.aiProvider.analyzeNotes(
        [
          {
            id: "temp",
            content,
            subject: "General",
            timestamp: new Date(),
            format: "text",
          },
        ],
        "General"
      );

      return this.parseSubjectResponse(response.structuredContent);
    } catch (error) {
      console.warn("AI subject detection failed, using fallback:", error);
      return this.fallbackDetection(content);
    }
  }

  private getSubjectDetectionPrompt(content: string): string {
    return `Analyze this note content and determine the most appropriate subject category:

Content: "${content}"

Available subjects: Math, Science, History, Literature, Language, General, Other

Return your analysis in this format:
SUBJECT: [most appropriate subject]
CONFIDENCE: [0-100]
ALTERNATIVES: [comma-separated alternative subjects]
REASONING: [brief explanation of why this subject was chosen]

Focus on the main topics, concepts, and context of the content.`;
  }

  private parseSubjectResponse(response: string): SubjectDetectionResult {
    const lines = response.split("\n").map((line) => line.trim());

    let detectedSubject = "General";
    let confidence = 50;
    let alternativeSubjects: string[] = [];
    let reasoning = "AI analysis";

    for (const line of lines) {
      if (line.startsWith("SUBJECT:")) {
        detectedSubject = line.replace("SUBJECT:", "").trim();
      } else if (line.startsWith("CONFIDENCE:")) {
        const confStr = line.replace("CONFIDENCE:", "").trim();
        confidence = parseInt(confStr) || 50;
      } else if (line.startsWith("ALTERNATIVES:")) {
        const altStr = line.replace("ALTERNATIVES:", "").trim();
        alternativeSubjects = altStr
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      } else if (line.startsWith("REASONING:")) {
        reasoning = line.replace("REASONING:", "").trim();
      }
    }

    return {
      detectedSubject,
      confidence,
      alternativeSubjects,
      reasoning,
    };
  }

  private fallbackDetection(content: string): SubjectDetectionResult {
    const lowerContent = content.toLowerCase();

    // Keyword-based detection
    const subjectKeywords = {
      Math: [
        "math",
        "mathematics",
        "algebra",
        "geometry",
        "calculus",
        "equation",
        "formula",
        "solve",
        "problem",
        "number",
        "add",
        "subtract",
        "multiply",
        "divide",
      ],
      Science: [
        "science",
        "biology",
        "chemistry",
        "physics",
        "experiment",
        "hypothesis",
        "theory",
        "molecule",
        "atom",
        "cell",
        "organism",
        "energy",
        "force",
      ],
      History: [
        "history",
        "historical",
        "war",
        "battle",
        "ancient",
        "medieval",
        "century",
        "empire",
        "kingdom",
        "revolution",
        "timeline",
        "date",
      ],
      Literature: [
        "literature",
        "book",
        "novel",
        "poetry",
        "poem",
        "author",
        "character",
        "plot",
        "theme",
        "symbolism",
        "metaphor",
        "story",
      ],
      Language: [
        "language",
        "grammar",
        "vocabulary",
        "sentence",
        "word",
        "verb",
        "noun",
        "adjective",
        "pronunciation",
        "translation",
        "speak",
      ],
    };

    let bestSubject = "General";
    let maxScore = 0;
    const alternativeSubjects: string[] = [];

    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          score += 1;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestSubject = subject;
      }

      if (score > 0) {
        alternativeSubjects.push(subject);
      }
    }

    const confidence = Math.min(95, maxScore * 15); // Scale score to confidence percentage

    return {
      detectedSubject: bestSubject,
      confidence,
      alternativeSubjects: alternativeSubjects.filter((s) => s !== bestSubject),
      reasoning:
        maxScore > 0
          ? `Detected ${maxScore} relevant keywords for ${bestSubject}`
          : "No specific subject keywords found",
    };
  }

  // Get available subjects
  getAvailableSubjects(): string[] {
    return ["General", "Math", "Science", "History", "Literature", "Language", "Other"];
  }

  // Validate subject
  isValidSubject(subject: string): boolean {
    return this.getAvailableSubjects().includes(subject);
  }
}
