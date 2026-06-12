import { getApiRequestBaseUrl } from "./config";

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

  let response: Response;
  try {
    response = await fetch(`${getApiRequestBaseUrl()}${path}`, {
      ...rest,
      headers: requestHeaders,
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    });
  } catch {
    throw new ApiError(
      "Impossible de joindre l'API. Vérifie ta connexion ou réessaie si le serveur Render vient de se réveiller.",
      0,
      path,
    );
  }

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
