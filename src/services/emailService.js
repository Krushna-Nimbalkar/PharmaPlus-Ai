const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const drugNotificationTemplate = (doctorName, drug, appUrl) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fbff;border:1px solid #e5edff;border-radius:10px;">
    <h2 style="color:#1f4bd8;margin-bottom:10px;">New Drug Alert - PharmaPulse AI</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>A new drug has been added that matches your specialization:</p>
    <div style="background:#fff;border:1px solid #dbe5ff;border-radius:8px;padding:14px;">
      <p><strong>Drug Name:</strong> ${drug.name}</p>
      <p><strong>Category:</strong> ${drug.category}</p>
      <p><strong>Description:</strong> ${drug.description}</p>
    </div>
    <p style="margin-top:16px;">Please login to your dashboard to review and share your feedback.</p>
    <a href="${appUrl}" style="display:inline-block;background:#1f4bd8;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Open Dashboard</a>
    <p style="margin-top:20px;color:#666;font-size:12px;">This is an automated email from PharmaPulse AI.</p>
  </div>
`;

const sendDrugNotification = async (doctor, drug) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5000';
  await transporter.sendMail({
    from: `PharmaPulse AI <${process.env.EMAIL}>`,
    to: doctor.email,
    subject: `New Drug Match: ${drug.name}`,
    html: drugNotificationTemplate(doctor.name, drug, appUrl),
  });
};

module.exports = { sendDrugNotification };
