import { apiRequest } from "./client";
import { ApiPaths } from "./config";
import type { AuthUser, FormSchema, LoginResponse } from "../types";
import { getAccessToken } from "../auth/session";

export async function fetchLoginForm(): Promise<FormSchema> {
  return apiRequest<FormSchema>(ApiPaths.authLoginForm);
}

export async function fetchRegisterForm(): Promise<FormSchema> {
  return apiRequest<FormSchema>(ApiPaths.authRegisterForm);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(ApiPaths.authLogin, {
    method: "POST",
    body: { email, password },
  });
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ message: string; user: AuthUser }> {
  return apiRequest(ApiPaths.authRegister, {
    method: "POST",
    body: { name, email, password },
  });
}

export async function fetchMe(token?: string | null): Promise<AuthUser> {
  return apiRequest<AuthUser>(ApiPaths.authMe, {
    token: token ?? getAccessToken(),
  });
}

export async function logout(refreshToken: string, token?: string | null) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
    token: token ?? getAccessToken(),
  });
}
