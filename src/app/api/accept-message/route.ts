import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import { User } from "next-auth";

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
      { _id: userId },
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    console.log(updatedUser, "user");

    if (!updatedUser) {
      console.error("Falided to update");
      return Response.json(
        { success: false, message: "Falided to update" },
        { status: 401 }
      );
    } else {
      return Response.json({
        success: 201,
        message: `Your are now ${
          acceptMessages ? "" : "not"
        } accepting messages`,
      });
    }
  } catch (error) {
    console.error("Falided to update", error);
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

    // console.log(userObject);
    if (!userObject) {
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, isAcceptingMessage: userObject.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Falided to fetch");
    return Response.json(
      { success: false, message: "Falided to fetch" },
      { status: 500 }
    );
  }
}
