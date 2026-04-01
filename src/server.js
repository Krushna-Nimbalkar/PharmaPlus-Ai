const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./seed/defaultAdmin');
const createDefaultUsers = require('./seed/defaultUsers');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/mr', require('./routes/mrRoutes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await createDefaultAdmin();
  await createDefaultUsers();
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})();
