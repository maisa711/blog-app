import { db } from "@utils/firebase";
import { doc } from "firebase/firestore";
import { NextResponse } from "next/server";


export const POST = async (req:any) => {
    const { userId, newEmail, newImage } = (await req.json());


    if (!userId || !newEmail) {
        return new NextResponse(
            JSON.stringify({
              status: "error",
              message: 'User ID and new email are required',
            }),
            { status: 400 }
          );
    }

    try {
        const postRef = doc(db, 'posts');
        
        return NextResponse.json({
            status: "success",
            message: 'Email updated successfully',
        });

      } catch (error: any) {
        console.error('Error updating email in posts:', error);
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: error.message,
            }),
            { status: 500 }
        );
      }

}
