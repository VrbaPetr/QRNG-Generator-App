import Image from "next/image";

export default function DashboardDivider() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full h-[1px] bg-gray-200 " />
      <Image
        src="/logos/small-ju.png"
        alt="judges"
        width={30}
        height={30}
        className="mx-4"
      />
      <div className="w-full h-[1px] bg-gray-200 " />
    </div>
  );
}
