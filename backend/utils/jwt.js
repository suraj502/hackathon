import jwt from 'jsonwebtoken';

export const signAdminToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
};

export const verifyAdminToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
