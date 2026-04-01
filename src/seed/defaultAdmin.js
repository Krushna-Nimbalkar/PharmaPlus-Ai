const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
  if (existingAdmin) {
    console.log('ℹ️ Default admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Default Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ Default admin created: admin@gmail.com / admin123');
};

module.exports = createDefaultAdmin;
