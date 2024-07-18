import { PrismaClient } from "@prisma/client";
import { createError } from "../error.js";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const addReferral = async (req, res, next) => {
  const { name, email, referredBy } = req.body;

  if (!name || !email || !referredBy) {
    return next(createError(400, "All fields are required"));
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        name,
        email,
        referredBy,
      },
    });

    sendReferralEmail(name, email, referredBy);

    res.status(200).json({
      success: true,
      message: "Referral added successfully",
      data: referral,
    });
  } catch (err) {
    next(err);
  }
};

const sendReferralEmail = async (name, email, referredBy) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: '"Referral System" <noreply@referralsystem.com>',
    to: email,
    subject: "Referral",
    text: `Hi ${name}, you have been referred by ${referredBy}`,
  };
  await transporter.sendMail(mailOptions);
};
