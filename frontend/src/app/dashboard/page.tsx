"use server";
import DashboardDivider from "@/components/DashboardDivider";
import Navbar from "@/components/Navbar";
import Tabs from "@/components/Tabs";
import { getRecords } from "@/server/recordAction";
import { decodeUserInfo } from "@/utils/utils-functions";
import { redirect } from "next/navigation";
import { getOboryStudijnihoProgramu, getUser } from "../actions";
import { Program, RecordItem } from "@/utils/app-types";

type PageProps = {
  searchParams: Promise<{
    stagUserTicket?: string;
    stagUserInfo?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  try {
    const { stagUserTicket, stagUserInfo } = await searchParams;
    const role = process.env.ROLE;

    // Add proper error handling for each async operation
    let user;
    try {
      user = await getUser();
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Continue with null user - we'll handle authentication below
    }

    let records: RecordItem[] = [];
    try {
      records = (await getRecords()) ?? [];
    } catch (error) {
      console.error("Failed to fetch records:", error);
      // Continue with empty records
    }

    const userInfo = stagUserInfo
      ? decodeUserInfo(stagUserInfo, stagUserTicket ?? "")
      : user;

    let programList: Program[] = [];
    try {
      const programsArray = await getOboryStudijnihoProgramu();
      programList =
        programsArray?.programInfo?.map((program: Program) => program) ?? [];
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    }

    // Authentication check
    if (!stagUserTicket && !user) {
      redirect("/sign-in");
    }

    // Authorization check
    if (
      user ||
      (userInfo && userInfo.role === role) ||
      userInfo?.role === role
    ) {
      return (
        <div>
          <Navbar
            user={{
              email: userInfo?.email,
              userName: userInfo?.userName,
              ticket: userInfo?.ticket ?? "",
              role: userInfo?.role,
            }}
          />
          <DashboardDivider />
          <Tabs
            programs={programList}
            history={records}
            user={{
              email: userInfo?.email,
              userName: userInfo?.userName,
              ticket: stagUserTicket ?? "",
              role: userInfo?.role,
            }}
          />
        </div>
      );
    }

    redirect("/sign-in");
  } catch (error) {
    // Global error handler for the entire page
    console.error("Dashboard page error:", error);
  }
}
