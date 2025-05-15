import { Program, RecordItem, User } from "@/utils/app-types";
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import GeneratorForm from "./GeneratorForm";

type GenerateQuestionComponentProps = {
  user: User;
  programs: Program[];
  records?: RecordItem[];
  countdown: number;
};

export function GenerateQuestionComponent({
  user,
  programs,
  records = [],
  countdown,
}: GenerateQuestionComponentProps) {
  const [displayedRecord, setDisplayedRecord] = useState<RecordItem>(
    {} as RecordItem
  );

  useEffect(() => {
    if (records.length) {
      setDisplayedRecord(records[records.length - 1]);
    }
  }, [records]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="self-start">
        <GeneratorForm user={user} programs={programs} />
      </div>
      <div>
        <div className="border border-gray-200 rounded-sm lg:ml-4 h-full p-4 flex flex-col justify-center items-center relative">
          <button
            onClick={handleRefresh}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Refresh question"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-500" />
          </button>

          <p className="text-gray-500 mb-2">Vygenerované číslo:</p>
          <h2 className="text-8xl font-bold text-[#E00234] p-8 rounded-sm mb-2">
            {displayedRecord && displayedRecord.examiner === user.userName
              ? displayedRecord.result
              : "N/A"}
          </h2>

          {/* live countdown */}
          <p className="text-gray-500 mb-4">Další kontrola za:{countdown} s</p>

          {displayedRecord?.student === "SYNC_GEN" && (
            <p className="text-gray-500 mb-2 font-bold">
              Vygenerováno na druhém zařízení
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
