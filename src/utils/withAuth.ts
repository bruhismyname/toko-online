import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: any, allowedRoles: string[] = []) {
  console.log("jalan")
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token;
      console.log("Token:", token);
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const decoded = jwt.verify(token, SECRET) as any;

      console.log("Decoded token:", decoded);

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        console.log("Role not allowed");
        return res.status(403).json({ message: "Forbidden", redirect: "/" });
      }

      (req as any).user = decoded;
      return handler(req, res);
    } catch (e) {
      return res.status(401).json({ message: "Invalid token", redirect: "/" });
    }
  };
}
