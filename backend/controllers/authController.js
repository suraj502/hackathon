import bcrypt from 'bcrypt';

import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { Admin } from '../models/Admin.js';
import { signAdminToken } from '../utils/jwt.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

  if (!admin) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, admin.password);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signAdminToken(admin);

  return res.status(200).json({
    success: true,
    message: 'Admin login successful',
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
});
