import 'dotenv/config';

import bcrypt from 'bcrypt';

import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';

const seedAdmin = async () => {
  await connectDB();

  const email = String(process.env.ADMIN_EMAIL || 'admin@nexterra.dev').trim().toLowerCase();
  const name = String(process.env.ADMIN_NAME || 'Administrator').trim();
  const password = String(process.env.ADMIN_PASSWORD || 'ChangeMe123!');

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    await Admin.db.close();
    process.exit(0);
  }
console.log("Password from .env:", JSON.stringify(password));
 await Admin.create({
  name,
  email,
  password: password,
  role: 'admin',
});

  console.log(`Seeded admin account: ${email}`);
  await Admin.db.close();
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Failed to seed admin account:', error);
  Admin.db.close().catch(() => {});
  process.exit(1);
});
