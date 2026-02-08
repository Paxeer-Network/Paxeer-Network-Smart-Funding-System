/**
 * Strips HTML tags and script-injection patterns from user input.
 * Used on profile fields before sending to the backend.
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:\s*text\/html/gi, "")
    .trim();
}

/**
 * Sanitizes all string values in an object (shallow).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === "string") {
      (result as Record<string, unknown>)[key] = sanitizeInput(val);
    }
  }
  return result;
}
