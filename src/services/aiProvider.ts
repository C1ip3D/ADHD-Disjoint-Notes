export interface Note {
  id: string;
  content: string;
  subject: string;
  timestamp: Date;
  format: "text" | "markdown";
}

export interface ProcessedNote {
  structuredContent: string;
  connections: string[];
  gaps: string[];
  suggestions: string[];
  keyPoints?: string[];
  mainIdeas?: string;
  examples?: string[];
  practiceProblems?: string[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export abstract class AIProvider {
  abstract analyzeNotes(notes: Note[], subject: string): Promise<ProcessedNote>;
  abstract generateOutline(notes: Note[], subject: string): Promise<string>;
  abstract findConnections(notes: Note[]): Promise<string[]>;
}
