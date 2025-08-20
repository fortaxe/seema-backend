import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { role: string };
}

type AllowedRoles = string | string[];

const authMiddleware = (allowedRoles: AllowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).send("Unauthorized: No token provided");
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload & { role: string };

      if (!roles.includes(decoded.role)) {
        res.status(403).send("Forbidden: Insufficient permissions");
        return;
      }

      req.user = decoded;
      next(); // ✅ Success — continue
    } catch (error) {
      res.status(401).send("Invalid token");
      return;
    }
  };
};


export default authMiddleware;