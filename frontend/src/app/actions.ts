"use server"; // IMPORTANT: This must be the FIRST line in the file

import { User } from "@/utils/app-types";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { encrypt, decrypt } from "../utils/encrypt";
import { logSignIn, logSignOut } from "@/server/logsAction";

const getSecretKey = async () => {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret || secret.length < 32) {
      console.error("JWT_SECRET_KEY is missing or too short");
      throw new Error("Invalid secret key configuration");
    }
    return new TextEncoder().encode(secret);
  } catch (error) {
    console.error("Error getting secret key:", error);
    throw new Error("Failed to get secret key");
  }
};

// This needs to be a server action to modify cookies
export async function setUser(user: User) {
  "use server"; // Make sure this is a server action

  try {
    if (!user || !user.userName || !user.email) {
      throw new Error("Invalid user data provided");
    }

    const cookieStore = await cookies();

    const secretKey = await getSecretKey();
    const token = await new SignJWT({
      userName: user.userName,
      email: user.email,
      role: user.role || "",
      encryptedTicket: user.ticket ? encrypt(user.ticket) : "",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secretKey);

    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set({
      name: "user_session",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const tokenValue = cookieStore.get("user_session")?.value;
    if (!tokenValue) {
      throw new Error("Failed to set user_session cookie");
    }

    try {
      await logSignIn(user.userName);
    } catch (logError) {
      console.error("Error logging sign in:", logError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error setting user:", error);
    throw error;
  }
}

export async function getUser(): Promise<User | null> {
  "use server";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;

    if (!token) {
      return null;
    }

    try {
      const secretKey = await getSecretKey();
      const { payload } = await jwtVerify(token, secretKey);

      const user: User = {
        userName: payload.userName as string,
        email: payload.email as string,
        role: (payload.role as string) || "",
        ticket: payload.encryptedTicket
          ? decrypt(payload.encryptedTicket as string)
          : "",
      };

      if (!user.userName || !user.email) {
        console.warn(
          "Invalid user data in token, treating as not authenticated"
        );
        return null;
      }

      return user;
    } catch (jwtError) {
      // Token verification failed - likely expired or tampered
      console.warn("JWT verification failed:", jwtError);
      // Delete the invalid cookie
      cookieStore.delete("user_session");
      return null;
    }
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

export async function deleteUser() {
  "use server";

  try {
    const cookieStore = await cookies();

    try {
      const token = cookieStore.get("user_session")?.value;
      if (token) {
        const { payload } = await jwtVerify(token, await getSecretKey());
        const userName = payload.userName as string;
        if (userName) {
          await logSignOut(userName);
        }
      }
    } catch (logError) {
      console.error("Error logging sign out:", logError);
    }

    cookieStore.delete("user_session");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user session:", error);
    throw error;
  }
}
