"use client";
import { deleteUser } from "@/app/actions";
import { User } from "@/utils/app-types";
import Image from "next/image";
import { CiUser } from "react-icons/ci";

type NavbarProps = {
  user: User;
};
export default function Navbar({ user }: NavbarProps) {
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
            onClick={async () => {
              await deleteUser();
              window.location.href = "/sign-in";
            }}
          >
            Odhlásit
          </button>
        </li>
      </ul>
    </nav>
  );
}
