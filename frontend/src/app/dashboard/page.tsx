"use client";

import DashboardDivider from "@/components/DashboardDivider";
import Navbar from "@/components/Navbar";
import Tabs from "@/components/Tabs";
import { Program, RecordItem, User, UserRoles } from "@/utils/app-types";
import { decodeUserInfo } from "@/utils/utils-functions";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { getRecords } from "@/server/recordAction";
import { deleteUser, getUser, setUser } from "../actions";

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">Načítání...</p>
    </div>
  );
}

import { getOboryStudijnihoProgramu } from "@/server/stagAtion";
import { useSearchParams } from "next/navigation";

function DashboardWithParams() {
  const [user, setCurrentUser] = useState<User | null>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  const stagUserTicket = searchParams.get("stagUserTicket") || "";
  const stagUserInfo = searchParams.get("stagUserInfo") || "";

  const fetchRecords = useCallback(async () => {
    try {
      const fetchedRecords = (await getRecords()) || [];
      setRecords(fetchedRecords);
      setCountdown(10);
    } catch (recordError) {
      console.error("Failed to fetch records:", recordError);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      fetchRecords();

      const recordsInterval = setInterval(() => {
        fetchRecords();
      }, 10000);

      return () => clearInterval(recordsInterval);
    }
  }, [isLoading, user, fetchRecords]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (!isLoading && user) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown > 0 ? prevCountdown - 1 : 10
        );
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isLoading, user]);

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);

        let currentUser: User | null = null;
        try {
          currentUser = await getUser();
        } catch (error) {
          console.error("Failed to get user from session:", error);
        }

        if (stagUserInfo && stagUserTicket) {
          try {
            const stagUser = decodeUserInfo(stagUserInfo, stagUserTicket);

            if (stagUser && stagUser.userName && stagUser.email) {
              try {
                await setUser(stagUser);
                router.push("/dashboard");
                currentUser = stagUser;
              } catch (setUserError) {
                console.error("Failed to set user in session:", setUserError);
              }
            }
          } catch (error) {
            console.error("Failed to decode STAG user info:", error);
          }
        }

        if (!currentUser || !currentUser.userName || !currentUser.email) {
          router.push("/sign-in");
          return;
        }

        setCurrentUser(currentUser);

        try {
          const programsResponse = await getOboryStudijnihoProgramu();
          const programList = programsResponse?.programInfo ?? [];

          console.log(programList);
          if (!Array.isArray(programList)) {
            console.warn(
              "Program list is not an array, using empty array instead"
            );
            setPrograms([]);
          } else {
            setPrograms(programList);
          }
        } catch (programError) {
          console.error("Failed to fetch programs:", programError);
          setPrograms([]);
        }

        const requireRole = process.env.NEXT_PUBLIC_REQUIRE_ROLE === "true";
        if (requireRole && !currentUser.role) {
          console.log("User missing required role, redirecting to sign-in");
          router.push("/sign-in");
          return;
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        setError("Failed to initialize dashboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router, stagUserInfo, stagUserTicket]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Načítání...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Něco se pokazilo</h1>
        <p className="mb-6">{error}</p>
        <button
          onClick={() => router.push("/sign-in")}
          className="px-4 py-2 bg-[#E00234] text-white rounded hover:bg-[#C00128]"
        >
          Vrátit se na přihlášení
        </button>
      </div>
    );
  }

  const userRole =
    user?.role === "VY" || user?.role === "AD" || user?.role === "ST";

  if (!user || !user.userName || !user.email) {
    router.push("/sign-in");
    return null;
  }

  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Nemáte oprávnění</h1>
        <p>Nemáte oprávnění k přístupu na tuto stránku.</p>
        <p className="mb-6">Zkontrolujte prosím svůj účet.</p>
        <button
          onClick={async () => {
            await deleteUser();
            router.push("/sign-in");
          }}
          className="px-4 py-2 bg-[#E00234] text-white rounded hover:bg-[#C00128]"
        >
          Vrátit se na přihlášení
        </button>
      </div>
    );
  }

  const safeUser: User = {
    email: user.email,
    userName: user.userName,
    ticket: user.ticket || "",
    role: user.role || "",
  };

  return (
    <div>
      <Navbar user={safeUser} />
      <DashboardDivider />
      <Tabs
        programs={programs}
        history={records}
        user={safeUser}
        userRole={safeUser.role as UserRoles}
        countdown={countdown}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardWithParams />
    </Suspense>
  );
}
