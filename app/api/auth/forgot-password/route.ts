import { NextResponse } from "next/server";
import crypto from "crypto";

import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import transporter from "@/lib/mail";

export async function POST(
  request: Request
) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const resetTokenExpires =
      new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires =
      resetTokenExpires;

    await user.save();

    const resetLink =
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `
        <h2>Password Reset</h2>

        <p>
          You requested to reset your password.
        </p>

        <p>
          Click the link below to reset your password:
        </p>

        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request this, you can ignore this email.
        </p>
      `,
    });

    return NextResponse.json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}