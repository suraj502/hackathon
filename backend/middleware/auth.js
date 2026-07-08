import { Admin } from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { verifyAdminToken } from '../utils/jwt.js';

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  let decoded;
  try {
    decoded = verifyAdminToken(token);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }

  if (decoded.role !== 'admin') {
    throw new AppError('Unauthorized access', 401);
  }

  const admin = await Admin.findById(decoded.sub).select('name email role createdAt updatedAt');

  if (!admin) {
    throw new AppError('Admin not found', 401);
  }

  req.admin = admin;
  next();
});
