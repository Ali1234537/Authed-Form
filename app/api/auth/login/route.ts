import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import {
  createToken,
  setToken,
} from "@/lib/auth";

export async function POST(
  request: Request
) {
  try {
    const data = await request.json();

    const email =
      data.email?.toLowerCase();

    const password = data.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          message:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "No user exists with this email",
        },
        { status: 401 }
      );
    }

    const correctPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!correctPassword) {
      return NextResponse.json(
        {
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = createToken(
      user._id.toString()
    );

    await setToken(token);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        message:
          "Something went wrong.",
      },
      { status: 500 }
    );
  }
}