const ONBOARDING_KEY = "focusly_onboarding_completed";

/**
 * Check if user has seen the onboarding flow
 */
export function hasSeenOnboarding(): boolean {
  try {
    const value = localStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error reading onboarding state:", error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Error saving onboarding state:", error);
  }
}

/**
 * Reset onboarding state (useful for testing or allowing users to replay)
 */
export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error("Error resetting onboarding state:", error);
  }
}
