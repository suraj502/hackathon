import bcrypt from 'bcrypt';

import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { Admin } from '../models/Admin.js';
import { signAdminToken } from '../utils/jwt.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Received email:", email);
  console.log("Received password:", password);

  const normalizedEmail = String(email).trim().toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail }).select("+password");

  console.log("Admin found:", !!admin);

  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  console.log("Stored hash:", admin.password);

  const passwordMatches = await bcrypt.compare(password, admin.password);

  console.log("Password matches:", passwordMatches);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  console.log("1. Password matched");

  const token = signAdminToken(admin);

  console.log("2. Token generated");

  const response = {
    success: true,
    message: "Admin login successful",
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  };

  console.log("3. About to send response");

  return res.status(200).json(response);
});