import LoginButton from "@/components/LoginButton";
import Image from "next/image";
import { headers } from "next/headers";
import { getUser } from "../actions";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const headersList = await headers();
  const host = headersList.get("host");
  const pathname = headersList.get("x-pathname") || "";
  const fullUrl = `${host}${pathname}`;

  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-12 border border-gray-200 rounded-md p-16">
        <Image
          src="/logos/logo-signin.jpg"
          alt="logo"
          width={300}
          height={100}
        />
        <LoginButton fullUrl={fullUrl} />
      </div>
    </div>
  );
}
