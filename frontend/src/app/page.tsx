import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  redirect("/sign-in");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Image src="/logos/small-ju.png" alt="logo" width={100} height={100} />
    </div>
  );
}
