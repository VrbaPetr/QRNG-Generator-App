"use client";

import {
  Program,
  RecordItem,
  User,
  UserRoles,
  LogTypeFilter,
  LogEntry,
} from "@/utils/app-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { GenerateQuestionComponent } from "./GenerateQuestionComponent";
import { HistoryComponent } from "./HistoryComponent";
import { TabSwitchComponent } from "./TabSwitchComponent";
import { ShowLogs } from "./ShowLogs";
import {
  logsAccess,
  logsActivity,
  logsError,
  logsFull,
} from "@/server/logsAction";

type TabsProps = {
  userRole: UserRoles;
  user: User;
  history: RecordItem[];
  programs: Program[];
  countdown: number;
};

export default function Tabs({
  user,
  history,
  programs,
  userRole,
  countdown,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState("generator");
  const [logsFullData, setLogsFullData] = useState<LogEntry[]>([]);
  const [logsErrorData, setLogsErrorData] = useState<LogEntry[]>([]);
  const [logsActivityData, setLogsActivityData] = useState<LogEntry[]>([]);
  const [logsAccessData, setLogsAccessData] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLogType, setActiveLogType] = useState<LogTypeFilter>("full");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = useCallback(async () => {
    if (userRole !== "ST" || activeTab !== "logs") {
      return;
    }

    setIsLoading(true);
    try {
      const [logsF, logsE, logsA, logsAcc] = await Promise.all([
        logsFull(),
        logsError(),
        logsActivity(),
        logsAccess(),
      ]);

      setLogsFullData(logsF as LogEntry[]);
      setLogsErrorData(logsE as LogEntry[]);
      setLogsActivityData(logsA as LogEntry[]);
      setLogsAccessData(logsAcc as LogEntry[]);

      console.log("Logs data fetched successfully");
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userRole, activeTab]);

  useEffect(() => {
    if (activeTab === "logs" && userRole === "ST") {
      fetchLogs();
    }
  }, [activeTab, userRole, fetchLogs]);

  const sortedHistory = useMemo(() => {
    if (userRole === "ST") {
      return [...history].sort((a, b) => (a.id > b.id ? 1 : -1));
    }
    return [...history]
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .filter((item) => item.examiner === user.userName);
  }, [history, user.userName, userRole]);

  return (
    <section className="container mx-auto flex flex-col h-full">
      <TabSwitchComponent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      <div className="flex-grow flex flex-col">
        {activeTab === "generator" && (
          <GenerateQuestionComponent
            user={user}
            programs={programs}
            records={history}
            countdown={countdown}
          />
        )}
        {activeTab === "history" && (
          <HistoryComponent history={sortedHistory} userRole={userRole} />
        )}
        {userRole === "ST" && activeTab === "logs" && (
          <ShowLogs
            logsFullData={logsFullData}
            logsErrorData={logsErrorData}
            logsActivityData={logsActivityData}
            logsAccessData={logsAccessData}
            isLoading={isLoading}
            fetchLogs={fetchLogs}
            activeLogType={activeLogType}
            setActiveLogType={setActiveLogType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </div>
    </section>
  );
}
