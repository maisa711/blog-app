import { authAdmin } from "@utils/firebaseAdmin";
import { NextResponse } from "next/server";

export const GET = async (req:any, {params}:any) => {

    try {
        const { id } = params;
        
        const user = await authAdmin.getUser(id as string);
        const customToken = await authAdmin.createCustomToken(id as string);
        
        return NextResponse.json({
            user: {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                customToken: customToken,
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
