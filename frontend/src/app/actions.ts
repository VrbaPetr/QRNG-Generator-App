"use server";
import { User } from "@/utils/app-types";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { encrypt, decrypt } from "../utils/encrypt";
import { logSignIn, logSignOut } from "@/server/logsAction";

const getSecretKey = async () => {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not set in environment variables");
    }
    return new TextEncoder().encode(secret);
  } catch (error) {
    console.error("Error getting secret key:", error);
    throw new Error("Failed to get secret key");
  }
};

export const setUser = async (user: User) => {
  try {
    if (!user || !user.userName || !user.email) {
      throw new Error("Invalid user data provided");
    }

    const cookieStore = await cookies();

    // Create JWT token
    const secretKey = await getSecretKey();
    const token = await new SignJWT({
      userName: user.userName,
      email: user.email,
      role: user.role,
      encryptedTicket: encrypt(user.ticket),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secretKey);

    // Set the cookie
    cookieStore.set({
      name: "user_session",
      value: token,

      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Verify the cookie was set and log sign in
    const tokenValue = cookieStore.get("user_session")?.value;
    if (!tokenValue) {
      throw new Error("Failed to set user_session cookie");
    }

    // Verify the token
    const { payload } = await jwtVerify(tokenValue, secretKey);
    const userName = payload.userName as string;
    console.log("User session created for:", userName);

    // Log the sign in
    await logSignIn(userName);

    return { success: true };
  } catch (error) {
    console.error("Error setting user:", error);
    // Re-throw the error to be caught by the client component
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, await getSecretKey());

    const user: User = {
      userName: payload.userName as string,
      email: payload.email as string,
      role: payload.role as string,
      ticket: decrypt(payload.encryptedTicket as string),
    };

    return user;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
};

export const deleteUser = async () => {
  try {
    const cookieStore = await cookies();

    const tokenValue = cookieStore.get("user_session")?.value;
    if (tokenValue) {
      const { payload } = await jwtVerify(tokenValue, await getSecretKey());
      const userName = payload.userName as string;
      console.log("Logging out user:", userName);
      await logSignOut(userName);
    }

    cookieStore.delete("user_session");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user session:", error);
    throw error;
  }
};

export async function getOboryStudijnihoProgramu() {
  try {
    const endpoint =
      "https://stag-ws.jcu.cz/ws/services/rest2/programy/getStudijniProgramy";

    const urlParams = new URLSearchParams({
      outputFormat: "JSON",
      fakulta: "FPR",
      pouzePlatne: "true",
    });

    const response = await fetch(`${endpoint}?${urlParams.toString()}`, {
      cache: "no-store", // Disable caching for this request
    });

    if (!response.ok) {
      throw new Error(`STAG API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching study programs:", error);
    throw error;
  }
}
