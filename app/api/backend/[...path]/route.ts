import { NextRequest, NextResponse } from "next/server";
import { normalizeBaseUrl } from "@/lib/api/config";

const UPSTREAM = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "https://backendrdv-jf71.onrender.com",
);

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const path = pathSegments.join("/");
  const search = request.nextUrl.search;
  const url = `${UPSTREAM}/${path}${search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (auth) headers.set("authorization", auth);
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(url, { method, headers, body });
  } catch {
    return NextResponse.json(
      {
        statusCode: 502,
        message:
          "Impossible de joindre l'API backend. Le serveur Render est peut-être en veille — réessaie dans quelques secondes.",
        error: "Bad Gateway",
      },
      { status: 502 },
    );
  }

  const responseBody = await upstream.arrayBuffer();
  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handler(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
