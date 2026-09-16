import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
  request: Request
) {
  try {
    const data = await request.json();

    const name = data.name;
    const email = data.email?.toLowerCase();
    const password = data.password;
     

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const userAlreadyExists =
      await User.findOne({ email });

    if (userAlreadyExists) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Account created." },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}