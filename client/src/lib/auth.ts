import { User } from "@shared/schema";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me");
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  
  return response.json();
}

export async function register(email: string, password: string, name: string, role: "broker" | "admin"): Promise<User> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }
  
  return response.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
