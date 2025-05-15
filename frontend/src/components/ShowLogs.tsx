import { LogEntry, LogTypeFilter } from "@/utils/app-types";
import { useMemo } from "react";
import { BiRefresh } from "react-icons/bi";
import { ExportButton } from "@/components/ExportButton";
import { FaMagnifyingGlass } from "react-icons/fa6";

type ShowLogsProps = {
  logsFullData: LogEntry[];
  logsErrorData: LogEntry[];
  logsActivityData: LogEntry[];
  logsAccessData: LogEntry[];
  isLoading: boolean;
  fetchLogs: () => void;
  activeLogType: LogTypeFilter;
  setActiveLogType: (type: LogTypeFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export function ShowLogs({
  logsFullData,
  logsErrorData,
  logsActivityData,
  logsAccessData,
  isLoading,
  fetchLogs,
  activeLogType,
  setActiveLogType,
  searchTerm,
  setSearchTerm,
}: ShowLogsProps) {
  const filteredLogData = useMemo(() => {
    let data;

    switch (activeLogType) {
      case "full":
        data = logsFullData;
        break;
      case "error":
        data = logsErrorData;
        break;
      case "activity":
        data = logsActivityData;
        break;
      case "access":
        data = logsAccessData;
        break;
      default:
        data = logsFullData;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((log) =>
        JSON.stringify(log).toLowerCase().includes(term)
      );
    }

    return data;
  }, [
    activeLogType,
    logsFullData,
    logsErrorData,
    logsActivityData,
    logsAccessData,
    searchTerm,
  ]);

  const LogFilterButton = ({
    type,
    label,
  }: {
    type: LogTypeFilter;
    label: string;
  }) => (
    <button
      onClick={() => setActiveLogType(type)}
      className={`${
        activeLogType === type ? "bg-[#E00234] text-white" : " text-gray-800"
      } p-2 border rounded  hover:bg-[#E00234] font-medium hover:text-white`}
      disabled={isLoading}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col flex-grow min-h-[600px] px-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-t-4 border-[#E00234] border-solid rounded-full animate-spin"></div>
          <p className="ml-2">Načítání logs...</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="py-4 bg-white sticky top-0 z-10 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Log Data</h2>
              <div className="flex space-x-2">
                <ExportButton
                  data={filteredLogData}
                  filename={`${activeLogType}_logs`}
                  showExportButton={filteredLogData.length > 0}
                />
                <button
                  onClick={fetchLogs}
                  className="p-2 border text-[#E00234] rounded hover:bg-red-50 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <BiRefresh size={21} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4  gap-2 mb-4">
              <LogFilterButton type="full" label="Full Logs" />
              <LogFilterButton type="error" label="Error Logs" />
              <LogFilterButton type="activity" label="Activity Logs" />
              <LogFilterButton type="access" label="Access Logs" />
            </div>

            <div className="mb-4 flex gap-4 items-center">
              <FaMagnifyingGlass />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Vyhledejte v logu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E00234] focus:border-[#E00234] transition duration-200"
              />
            </div>

            <div className="text-sm text-gray-600 mb-2">
              {filteredLogData.length} záznamů
            </div>
          </div>

          <div className="flex-grow overflow-auto p-4">
            <h3 className="text-lg font-semibold mb-2">
              {activeLogType.charAt(0).toUpperCase() + activeLogType.slice(1)}{" "}
              Logs
            </h3>
            {filteredLogData.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded flex items-center justify-center h-full">
                <p className="text-gray-500">No logs match your filters</p>
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-auto h-full">
                {JSON.stringify(filteredLogData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
