import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  statusCode: number;
  path?: string;

  constructor(message: string, statusCode: number, path?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.path = path;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...(body !== undefined && !(body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : typeof payload === "string" && payload
          ? payload
          : "Une erreur est survenue.";
    throw new ApiError(message, response.status, path);
  }

  return payload as T;
}
