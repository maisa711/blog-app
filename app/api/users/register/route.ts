import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@utils/firebase";


export const POST = async (req: Request) => {

  try {
    const { name, email, password, image } = (await req.json());
    
    console.log('this is an image', image);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name, photoURL: image })
    
    return NextResponse.json({
      user: {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      },
    });

  } catch (error: any) {
    console.log("Error:", error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
