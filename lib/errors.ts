/**
 * Normalizes any error shape into a human-readable string.
 * Handles Zod issues, Supabase errors, generic Error objects, strings, and
 * arbitrary JSON payloads returned from API routes.
 */
export function getErrorMessage(err: unknown): string {
  if (!err) return "Something went wrong. Please try again."

  if (typeof err === "string") return err

  if (Array.isArray(err)) {
    const msgs = err
      .map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object") {
          const path =
            Array.isArray(item.path) && item.path.length
              ? item.path.join(".") + ": "
              : ""
          if (typeof item.message === "string") return path + item.message
        }
        return null
      })
      .filter(Boolean)
    if (msgs.length) return msgs.join("; ")
  }

  if (typeof err === "object" && err !== null) {
    const obj = err as Record<string, unknown>

    if ("issues" in obj && Array.isArray(obj.issues)) {
      return getErrorMessage(obj.issues)
    }
    if ("errors" in obj && Array.isArray(obj.errors)) {
      return getErrorMessage(obj.errors)
    }
    if (typeof obj.message === "string" && obj.message) {
      return obj.message
    }
    if (
      typeof obj.error === "object" &&
      obj.error !== null &&
      typeof (obj.error as Record<string, unknown>).message === "string"
    ) {
      return (obj.error as Record<string, unknown>).message as string
    }
    if (typeof obj.error === "string" && obj.error) {
      return obj.error
    }

    try {
      const json = JSON.stringify(obj)
      if (json && json !== "{}") return json
    } catch {
      // not serializable
    }
  }

  return "Something went wrong. Please try again."
}

/**
 * Formats a Zod error array into a single human-readable string.
 * Used server-side in API routes before sending the response.
 */
export function formatZodErrors(
  errors: Array<{ path?: (string | number)[]; message?: string }>
): string {
  return errors
    .map((e) => {
      const path =
        Array.isArray(e.path) && e.path.length ? e.path.join(".") + ": " : ""
      return path + (e.message ?? "Invalid value")
    })
    .join("; ")
}
