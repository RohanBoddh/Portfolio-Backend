const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const sendEmailNotification = async ({ name, email, subject, message }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const receiver = process.env.RECEIVER_EMAIL || "rohanboddh9@gmail.com";

  if (!user || !pass) {
    console.log(
      "Notice: EMAIL_USER or EMAIL_PASS not set in .env. Message saved to MongoDB Atlas."
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${name} (Portfolio)" <${user}>`,
    replyTo: email,
    to: receiver,
    subject: `Portfolio Message from ${name}: ${subject}`,
    text: `You have received a new contact message from your portfolio.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px;">New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 15px; padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #0284c7;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Received from Rohan Boddh Portfolio Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
};

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    let emailSent = false;
    try {
      emailSent = await sendEmailNotification({ name, email, subject, message });
    } catch (mailError) {
      console.error("Nodemailer delivery error:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? "Your message and email have been sent successfully!"
        : "Your message has been received and saved successfully!",
      emailSent,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
};