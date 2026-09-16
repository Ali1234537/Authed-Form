import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
  request: Request
) {
  try {
    const { token, password } =
      await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          message:
            "Token and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Reset link is invalid or expired.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({
      message:
        "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
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