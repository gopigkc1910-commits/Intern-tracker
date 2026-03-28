/**
 * Fetch JSON from a relative endpoint with error handling
 * Automatically parses error responses and throws descriptive errors
 * @param input URL or Request path
 * @param init Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws Error with detail message on request failure
 * @example
 * const user = await clientJsonFetch<UserProfile>('/api/profile', { method: 'GET' });
 */
export async function clientJsonFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = (await response.json()) as { detail?: string };
      detail = data.detail ?? detail;
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
