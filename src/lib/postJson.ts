export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; aborted?: boolean };

export async function postJson<T>(url: string, body: unknown, signal?: AbortSignal): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error =
        data && typeof data.error === "string" ? data.error : "Something went wrong. Please try again.";
      return { ok: false, error };
    }
    if (!data) return { ok: false, error: "Something went wrong. Please try again." };
    return { ok: true, data: data as T };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Cancelled.", aborted: true };
    }
    return { ok: false, error: "Couldn't reach GlowUp. Check your connection and try again." };
  }
}
