import dbConnect from "@/lib/dbConnect";
import { Message } from "@/interfaces/user";
import UserModel from "@/model/User.model";
export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const reciepent = await UserModel.findOne({ username });

    if (!reciepent) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!reciepent.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User not accepting message" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    reciepent.messages.push(newMessage as Message);

    await reciepent.save();

    return Response.json(
      { success: false, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 404 }
    );
  }
}
