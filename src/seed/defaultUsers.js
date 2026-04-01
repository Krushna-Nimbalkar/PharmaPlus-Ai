const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUserIfMissing = async ({ name, email, password, role, specialization = '', company = '' }) => {
  const existing = await User.findOne({ email });
  if (existing) return false;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    specialization,
    company,
  });
  return true;
};

const createDefaultUsers = async () => {
  const seedEnabled = (process.env.SEED_DEMO_USERS || 'true').toLowerCase() === 'true';
  if (!seedEnabled) {
    console.log('ℹ️ Demo user seeding is disabled');
    return;
  }

  const doctorCreated = await seedUserIfMissing({
    name: 'Dr. Sarah Lee',
    email: 'doctor@gmail.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Cardiology',
  });

  const mrCreated = await seedUserIfMissing({
    name: 'Raj Mehta',
    email: 'mr@gmail.com',
    password: 'mr123',
    role: 'mr',
    company: 'Pulse Pharma',
  });

  if (doctorCreated || mrCreated) {
    console.log('✅ Demo users ready: doctor@gmail.com/doctor123 and mr@gmail.com/mr123');
  } else {
    console.log('ℹ️ Demo users already exist');
  }
};

module.exports = createDefaultUsers;
