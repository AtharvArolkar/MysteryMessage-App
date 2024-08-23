import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import { User } from "next-auth";
import { userAgent } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userAgent },
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      console.error("Falided to update");
      return Response.json(
        { success: false, message: "Falided to update" },
        { status: 401 }
      );
    } else {
      return Response.json({ success: 201 });
    }
  } catch (error) {
    console.error("Falided to update");
    return Response.json(
      { success: false, message: "Falided to update" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const userObject = await UserModel.findById({ _id: userId });

    if (!userObject) {
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, isAcceptingMessage: userObject.isAcceptingMessage },
      { status: 401 }
    );
  } catch (error) {
    console.error("Falided to fetch");
    return Response.json(
      { success: false, message: "Falided to fetch" },
      { status: 500 }
    );
  }
}
