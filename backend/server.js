const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const mrRoutes = require('./routes/mrRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'PharmaPulse AI' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/mr', mrRoutes);

const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@gmail.com', role: 'admin' });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Default admin created: admin@gmail.com / admin123');
  } else {
    console.log('Default admin already exists.');
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
