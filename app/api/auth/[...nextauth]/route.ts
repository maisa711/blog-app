import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@utils/firebase";

const handler = NextAuth({
  // Configure one or more authentication providers

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        console.log("credentials", credentials);
        
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        
        const { uid, refreshToken, displayName, email, photoURL } = user;
        
        if (!user) {
          return null;
        }

        return {
          id: uid,
          randomKey: refreshToken,
          name: displayName,
          email: email,
          image: photoURL,
        };
        
      }
    })
  ],

  
});

export { handler as GET, handler as POST };