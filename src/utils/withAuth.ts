import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: any, allowedRoles: string[] = []) {
  console.log("jalan")
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Not authenticated" });

      const decoded = jwt.verify(token, SECRET) as any;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      (req as any).user = decoded;
      return handler(req, res);
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
