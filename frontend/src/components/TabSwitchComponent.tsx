import { UserRoles } from "@/utils/app-types";

type TabSwitchComponentProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRoles;
};

export function TabSwitchComponent({
  activeTab,
  setActiveTab,
  userRole,
}: TabSwitchComponentProps) {
  return (
    <div className="flex gap-4 text-[#E00234] font-md mb-10 px-4 mt-5 lg:px-0">
      <button
        className={`cursor-pointer ${
          activeTab === "generator"
            ? "pb-2 border-b-2 border-[#E00234]"
            : "pb-2"
        }`}
        onClick={() => setActiveTab("generator")}
      >
        Generátor otázek
      </button>
      <button
        className={`cursor-pointer ${
          activeTab === "history" ? "pb-2 border-b-2 border-[#E00234]" : "pb-2"
        }`}
        onClick={() => setActiveTab("history")}
      >
        Historie
      </button>
      {userRole === "ST" && (
        <button
          className={`cursor-pointer ${
            activeTab === "logs" ? "pb-2 border-b-2 border-[#E00234]" : "pb-2"
          }`}
          onClick={() => setActiveTab("logs")}
        >
          Logy
        </button>
      )}
    </div>
  );
}
