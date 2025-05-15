"use client";
import { deleteUser } from "@/app/actions";
import { User } from "@/utils/app-types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";

type NavbarProps = {
  user: User;
};
export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const handleLogout = async () => {
    await deleteUser();
    localStorage.removeItem("generatedCode");

    router.push("/sign-in");
  };
  return (
    <nav className=" container mx-auto flex flex-col gap-8 lg:flex-row items-center justify-between pt-8 pb-4">
      <Image src="/logos/logo-signin.jpg" alt="logo" width={200} height={100} />
      <ul className="flex justify-between lg:justify-normal w-full lg:w-auto px-4 lg:p-0  gap-8">
        <div className="flex items-center  gap-2">
          <CiUser size={21} className="text-[#E00234]" />
          <p className="text-sm font-light">{user.email}</p>
        </div>
        <li>
          <button
            onClick={() => handleLogout()}
            className="bg-[#E00234] px-3 py-1.5 rounded-sm text-white hover:bg-[#C00128] transition-colors duration-200"
          >
            Odhlásit
          </button>
        </li>
      </ul>
    </nav>
  );
}
