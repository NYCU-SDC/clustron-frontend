// src/lib/auth.ts
import jwt from "jsonwebtoken";

const SECRET = "c2c68a58b33b4646876c68e693deeeea258dd48c53cd5c594b8a891614c"; // 這要放在 .env

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): unknown | null {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
