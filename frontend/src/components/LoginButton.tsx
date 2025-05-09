"use client";
import { useRouter } from "next/navigation";

export default function LoginButton({ fullUrl }: { fullUrl: string }) {
  const router = useRouter();
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-md"
      onClick={() =>
        router.push(
          `http://stag-ws.jcu.cz/ws/login?originalURL=http://${fullUrl}/dashboard`
        )
      }
    >
      Přihlásit se
    </button>
  );
}
