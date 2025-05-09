"use client";
import { setUser } from "@/app/actions";
import { Program, RecordItem, User } from "@/utils/app-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GenerateQuestionComponent } from "./GenerateQuestionComponent";
import { HistoryComponent } from "./HistoryComponent";
import { TabSwitchComponent } from "./TabSwitchComponent";

type TabsProps = {
  user: User;
  history: RecordItem[];
  programs: Program[];
};

export default function Tabs({ user, history, programs }: TabsProps) {
  const [activeTab, setActiveTab] = useState("generator");
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();

  const initUser = async (userData: User) => {
    try {
      const result = await setUser(userData);
      return { success: true, result };
    } catch (err) {
      console.error("Error in server action:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  useEffect(() => {
    if (!isInitialized && user) {
      const handleInitUser = async () => {
        const result = await initUser(user);
        if (result.success) {
          setIsInitialized(true);
          router.refresh();
        }
      };

      handleInitUser();
    }
  }, [user, router, isInitialized]);

  const sortedHistory = [...history].sort((a, b) => {
    return a.id > b.id ? 1 : -1;
  });

  return (
    <section className="container mx-auto">
      <TabSwitchComponent activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        {activeTab === "generator" && (
          <GenerateQuestionComponent
            user={user}
            programs={programs}
            records={history}
          />
        )}
        {activeTab === "history" && (
          <HistoryComponent history={sortedHistory} />
        )}
      </div>
    </section>
  );
}
