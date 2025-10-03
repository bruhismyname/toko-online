import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: string;
  role: string;
  exp: number;
};

export function getUserFromToken(): TokenPayload | null {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token); 
  } catch {
    return null;
  }
}
