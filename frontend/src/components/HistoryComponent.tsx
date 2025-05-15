import { RecordItem, UserRoles } from "@/utils/app-types";
import { CiClock1 } from "react-icons/ci";
import { ExportButton } from "@/components/ExportButton";

export function HistoryComponent({
  history,
  userRole,
}: {
  history: RecordItem[];
  userRole: UserRoles;
}) {
  return (
    <div className="p-4 md:p-6 bg-white rounded-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Historie otázek</h3>

        <ExportButton
          data={history}
          filename="historie_otazek"
          showExportButton={userRole === "ST" && history.length > 0}
        />
      </div>

      {history.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="hidden sm:block">
            <div className="overflow-hidden border border-gray-200 rounded-lg min-w-full">
              <div className="grid grid-cols-6 bg-gray-50 p-3 border-b border-gray-200 font-medium text-gray-600 text-sm">
                <div>Číslo otázky</div>
                <div>Student</div>
                <div>Počet otázek</div>
                <div>Vynechané otázky</div>
                <div>Číslo otázky</div>
                <div>Datum</div>
              </div>

              <div className="divide-y divide-gray-200">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 p-3 text-gray-700 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-[#E00234]">{item.id}</div>
                    <div className="font-medium text-gray-800">
                      {item.student}
                    </div>
                    <div className="text-gray-800">{item.pool_range}</div>
                    <div className="text-gray-800">{item.pool_excluded}</div>
                    <div className="font-medium text-[#E00234]">
                      {item.result}
                    </div>
                    <div className="text-gray-500">
                      {new Date(item.timestamp).toLocaleString("cs-CZ", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sm:hidden space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-[#E00234]">
                    Otázka: {item.result}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString("cs-CZ", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-medium text-gray-800">
                      {item.student}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">ID:</span>
                    <span className="text-gray-800">{item.id}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Počet otázek:</span>
                    <span className="text-gray-800">{item.pool_range}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Vynechané:</span>
                    <span className="text-gray-800">{item.pool_excluded}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 md:py-10 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 md:gap-6">
          <CiClock1 size={80} className="text-gray-400" />
          <p className="text-gray-500 font-medium">
            Zatím zde nejsou žádné záznamy
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Historie se zobrazí po vygenerování otázek
          </p>
        </div>
      )}
    </div>
  );
}
