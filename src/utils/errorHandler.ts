/**
 * Centralized Error Handling Utility
 * Provides consistent error handling and user-friendly messages across the application
 */

export interface ErrorDetails {
  message: string;
  userMessage: string;
  code?: string;
  severity: "error" | "warning" | "info";
  action?: string;
}

export class AppError extends Error {
  public readonly userMessage: string;
  public readonly code?: string;
  public readonly severity: "error" | "warning" | "info";
  public readonly action?: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = "AppError";
    this.userMessage = details.userMessage;
    this.code = details.code;
    this.severity = details.severity;
    this.action = details.action;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error categories and their user-friendly messages
 */
const errorMessages: Record<string, (error: any) => ErrorDetails> = {
  // Firebase Authentication Errors
  "auth/user-not-found": () => ({
    message: "User not found",
    userMessage: "No account found with this email address.",
    code: "auth/user-not-found",
    severity: "error",
    action: "Please check your email or sign up for a new account.",
  }),

  "auth/wrong-password": () => ({
    message: "Wrong password",
    userMessage: "Incorrect password.",
    code: "auth/wrong-password",
    severity: "error",
    action: "Please try again or reset your password.",
  }),

  "auth/email-already-in-use": () => ({
    message: "Email already in use",
    userMessage: "An account with this email already exists.",
    code: "auth/email-already-in-use",
    severity: "error",
    action: "Please sign in or use a different email address.",
  }),

  "auth/weak-password": () => ({
    message: "Weak password",
    userMessage: "Password should be at least 6 characters.",
    code: "auth/weak-password",
    severity: "error",
    action: "Please choose a stronger password.",
  }),

  "auth/invalid-email": () => ({
    message: "Invalid email",
    userMessage: "Please enter a valid email address.",
    code: "auth/invalid-email",
    severity: "error",
  }),

  "auth/user-disabled": () => ({
    message: "User disabled",
    userMessage: "This account has been disabled.",
    code: "auth/user-disabled",
    severity: "error",
    action: "Please contact support for assistance.",
  }),

  "auth/too-many-requests": () => ({
    message: "Too many requests",
    userMessage: "Too many failed attempts. Please try again later.",
    code: "auth/too-many-requests",
    severity: "warning",
    action: "Wait a few minutes before trying again.",
  }),

  "auth/network-request-failed": () => ({
    message: "Network error",
    userMessage: "Network error. Please check your connection.",
    code: "auth/network-request-failed",
    severity: "error",
    action: "Check your internet connection and try again.",
  }),

  "auth/invalid-credential": () => ({
    message: "Invalid credentials",
    userMessage: "Invalid email or password.",
    code: "auth/invalid-credential",
    severity: "error",
    action: "Please check your credentials and try again.",
  }),

  // Firestore Errors
  "firestore/permission-denied": () => ({
    message: "Permission denied",
    userMessage: "You don't have permission to access this resource.",
    code: "firestore/permission-denied",
    severity: "error",
    action: "Please sign in or contact support if this persists.",
  }),

  "firestore/not-found": () => ({
    message: "Resource not found",
    userMessage: "The requested resource was not found.",
    code: "firestore/not-found",
    severity: "error",
  }),

  "firestore/unavailable": () => ({
    message: "Service unavailable",
    userMessage: "Service temporarily unavailable.",
    code: "firestore/unavailable",
    severity: "warning",
    action: "Please try again in a moment.",
  }),

  // AI Service Errors
  "ai/backend-unavailable": () => ({
    message: "AI backend unavailable",
    userMessage: "AI service is currently unavailable.",
    code: "ai/backend-unavailable",
    severity: "error",
    action: "Please ensure the backend server is running on port 5001.",
  }),

  "ai/rate-limit": () => ({
    message: "Rate limit exceeded",
    userMessage: "Too many AI requests. Please wait a moment.",
    code: "ai/rate-limit",
    severity: "warning",
    action: "Wait a few seconds before trying again.",
  }),

  "ai/invalid-response": () => ({
    message: "Invalid AI response",
    userMessage: "Received invalid response from AI service.",
    code: "ai/invalid-response",
    severity: "error",
    action: "Please try again.",
  }),

  // Canvas LMS Errors
  "canvas/invalid-credentials": () => ({
    message: "Invalid Canvas credentials",
    userMessage: "Invalid Canvas access token or URL.",
    code: "canvas/invalid-credentials",
    severity: "error",
    action: "Please check your Canvas credentials in settings.",
  }),

  "canvas/connection-failed": () => ({
    message: "Canvas connection failed",
    userMessage: "Failed to connect to Canvas LMS.",
    code: "canvas/connection-failed",
    severity: "error",
    action: "Check your Canvas URL and ensure the backend server is running.",
  }),

  // Network Errors
  "network/timeout": () => ({
    message: "Request timeout",
    userMessage: "Request timed out.",
    code: "network/timeout",
    severity: "warning",
    action: "Please check your internet connection and try again.",
  }),

  "network/offline": () => ({
    message: "No internet connection",
    userMessage: "You appear to be offline.",
    code: "network/offline",
    severity: "error",
    action: "Please check your internet connection.",
  }),

  // Generic errors
  default: (error: any) => ({
    message: error?.message || "Unknown error",
    userMessage: "An unexpected error occurred.",
    code: "unknown",
    severity: "error" as const,
    action: "Please try again or contact support if the problem persists.",
  }),
};

/**
 * Get default error details
 */
function getDefaultError(error: any): ErrorDetails {
  return {
    message: error?.message || "Unknown error",
    userMessage: "An unexpected error occurred.",
    code: "unknown",
    severity: "error",
    action: "Please try again or contact support if the problem persists.",
  };
}

/**
 * Handle any error and return user-friendly error details
 */
export function handleError(error: any): ErrorDetails {
  console.error("Error caught by handler:", error);

  // If it's already an AppError, return its details
  if (error instanceof AppError) {
    return {
      message: error.message,
      userMessage: error.userMessage,
      code: error.code,
      severity: error.severity,
      action: error.action,
    };
  }

  // Extract error code from Firebase or custom errors
  const errorCode = error?.code || error?.name;

  // Try to find a matching error handler
  if (errorCode && errorMessages[errorCode]) {
    return errorMessages[errorCode](error);
  }

  // Check for specific error patterns
  if (
    error?.message?.includes("backend") ||
    error?.message?.includes("Backend")
  ) {
    const handler = errorMessages["ai/backend-unavailable"];
    return handler ? handler(error) : getDefaultError(error);
  }

  if (
    error?.message?.includes("network") ||
    error?.message?.includes("Network")
  ) {
    const handler = errorMessages["network/timeout"];
    return handler ? handler(error) : getDefaultError(error);
  }

  if (error?.message?.includes("Canvas")) {
    const handler = errorMessages["canvas/connection-failed"];
    return handler ? handler(error) : getDefaultError(error);
  }

  // Default error handler
  return getDefaultError(error);
}

/**
 * Format error for display to user
 */
export function formatErrorMessage(details: ErrorDetails): string {
  let message = details.userMessage;
  if (details.action) {
    message += ` ${details.action}`;
  }
  return message;
}

/**
 * Log error for debugging (in development) or to monitoring service (in production)
 */
export function logError(error: any, context?: string) {
  const details = handleError(error);

  if (import.meta.env.DEV) {
    console.group(`🔴 Error${context ? ` in ${context}` : ""}`);
    console.error("Message:", details.message);
    console.error("User Message:", details.userMessage);
    console.error("Code:", details.code);
    console.error("Severity:", details.severity);
    if (details.action) console.error("Action:", details.action);
    console.error("Original Error:", error);
    console.groupEnd();
  } else {
    // In production, send to monitoring service (e.g., Sentry, LogRocket)
    // Example: Sentry.captureException(error, { extra: { details, context } });
    console.error("Error:", details.userMessage);
  }
}

/**
 * Utility to create a toast notification from error
 * (To be used with a toast/notification library)
 */
export function createErrorNotification(error: any): {
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  duration?: number;
} {
  const details = handleError(error);

  return {
    title: details.severity === "error" ? "Error" : "Warning",
    message: formatErrorMessage(details),
    type: details.severity,
    duration: details.severity === "error" ? 5000 : 3000,
  };
}

/**
 * Async wrapper with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<[T | null, ErrorDetails | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    logError(error, context);
    const details = handleError(error);
    return [null, details];
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
