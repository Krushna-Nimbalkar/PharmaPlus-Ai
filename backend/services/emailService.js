const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const buildDrugEmailHtml = ({ doctorName, drug, dashboardUrl }) => `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:16px;border:1px solid #e5e7eb;border-radius:12px;">
    <h2 style="color:#1d4ed8;margin-bottom:8px;">New Drug Alert - PharmaPulse AI</h2>
    <p>Hello Dr. ${doctorName},</p>
    <p>A new drug relevant to your specialization has been submitted by an MR.</p>

    <div style="background:#f8fafc;padding:12px;border-radius:8px;margin:12px 0;">
      <p><strong>Name:</strong> ${drug.name}</p>
      <p><strong>Category:</strong> ${drug.category}</p>
      <p><strong>Description:</strong> ${drug.description}</p>
      <p><strong>Target Specialization:</strong> ${drug.targetSpecialization}</p>
    </div>

    <a href="${dashboardUrl}" style="display:inline-block;padding:10px 16px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:8px;">Login to Dashboard</a>
    <p style="margin-top:16px;color:#6b7280;">Regards,<br/>PharmaPulse AI Team</p>
  </div>
`;

const sendDrugNotification = async ({ recipients, drug }) => {
  if (!process.env.EMAIL || !process.env.PASS) {
    console.warn('Email credentials missing. Skipping email notifications.');
    return;
  }

  const dashboardUrl = `${process.env.FRONTEND_URL || 'http://127.0.0.1:5500/frontend'}/index.html`;

  for (const doctor of recipients) {
    const mailOptions = {
      from: `PharmaPulse AI <${process.env.EMAIL}>`,
      to: doctor.email,
      subject: `New Drug Update: ${drug.name}`,
      html: buildDrugEmailHtml({ doctorName: doctor.name, drug, dashboardUrl })
    };

    await transporter.sendMail(mailOptions);
  }
};

module.exports = { sendDrugNotification };
