import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import { getCurrentUser } from "@/lib/auth";

import User from "@/models/User";

export async function PATCH(
  request: Request
) {

  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message:
          "You are not logged in.",
      },
      {
        status: 401,
      }
    );
  }

  const data = await request.json();

  const name = data.name;

  const email =
    data.email?.toLowerCase();

  if (!name || !email) {
    return NextResponse.json(
      {
        message:
          "Name and email are required.",
      },
      {
        status: 400,
      }
    );
  }

  await connectDB();

  const updatedUser =
    await User.findByIdAndUpdate(
      currentUser.id,
      {
        name,
        email,
      },
      {
        new: true,
      }
    );

  return NextResponse.json({
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
}