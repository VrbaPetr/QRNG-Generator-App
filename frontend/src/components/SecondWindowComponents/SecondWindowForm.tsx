"use client";
import { deactivateCode, getCode } from "@/server/codeAction";
import { getRecords, insertRecord } from "@/server/recordAction";
import { RecordItem } from "@/utils/app-types";
import { useState } from "react";

export function SecondWindowForm() {
  const [generate, setGenerate] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<string>("0");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lockBtn, setLockBtn] = useState<boolean>(false);
  const [record, setRecord] = useState<RecordItem>({} as RecordItem);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const entryCode = formData.get("code") as string;
    setCode(entryCode);

    if (!entryCode) {
      setError("Prosím vyplňte kód");
      setIsLoading(false);
      return;
    }

    try {
      const response = await getCode(entryCode);
      console.log("Code response:", response);
      if (!response) {
        setError("Neplatný kód");
        setIsLoading(false);
        return;
      }

      const isActive = Number(response.is_active) === 1;
      if (!isActive) {
        setError("Kód již není aktivní");
        setGenerate(false);
        setIsLoading(false);
        return;
      }

      setError(null);
      setRecord(response);
      setGenerate(true);
    } catch (err) {
      console.error("Error fetching code:", err);
      setError("Chyba při ověřování kódu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = async () => {
    try {
      console.log(code);
      await deactivateCode(code);
      setIsGenerating(true);
      setGenerationError(null);
      setLockBtn(true);

      // Insert new record
      const formData = new FormData();
      formData.append("program", record.program);
      formData.append("student", record.student);
      formData.append("pool_excluded", record.pool_excluded || "0");
      formData.append("pool_range", record.pool_range.toString());
      formData.append("examiner", record.examiner);
      formData.append("exam", record.exam || "SZZ");
      await insertRecord(formData);
      await deactivateCode(code);

      const allRecords = await getRecords();
      const filtered = allRecords.filter(
        (item: RecordItem) => item.examiner === record.examiner
      );
      const last =
        filtered.length > 0 ? filtered[filtered.length - 1].result : "0";
      setQuestionNumber(last);

      setTimeout(() => setLockBtn(false), 60000);
    } catch (err) {
      console.error("Error generating number:", err);
      setGenerationError("Nepodařilo se vygenerovat číslo");
      const fallbackNumber = Math.floor(Math.random() * 100) + 1;
      try {
        const allRecords = await getRecords();
        const filtered = allRecords.filter(
          (item: RecordItem) => item.examiner === record.examiner
        );
        const last =
          filtered.length > 0
            ? filtered[filtered.length - 1].result
            : fallbackNumber.toString();
        setQuestionNumber(last);
      } catch {
        setQuestionNumber(fallbackNumber.toString());
      }
    } finally {
      setIsGenerating(false);
      await deactivateCode(code);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      {!generate ? (
        <div className="w-full max-w-md border border-slate-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Zadejte kód
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="code" className="text-gray-600 font-medium">
                Kód
              </label>
              <input
                id="code"
                name="code"
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E00234]/50 focus:border-[#E00234]"
                placeholder="Zadejte párovací kód"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm py-1">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E00234] text-white py-3 rounded-md hover:bg-[#E00234]/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Načítání..." : "Odeslat"}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          <div className="bg-[#E00234] w-full max-w-md p-4 text-slate-50 rounded-sm font-medium text-xl">
            <p className="font-bold">Generuje student: {record.student}</p>
          </div>

          <div className="border border-slate-200 p-6 rounded-lg shadow-sm text-center w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Číslo</h2>
            <h1 className="text-6xl font-bold text-center my-10 text-[#E00234]">
              {questionNumber}
            </h1>

            {generationError && (
              <div className="text-orange-500 text-sm mb-3">
                {generationError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateAgain}
              disabled={lockBtn}
              className="p-2 border border-[#E00234] text-[#E00234] rounded hover:bg-red-50 font-medium w-full disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {lockBtn
                ? "Počkejte 60 sekund"
                : isGenerating
                ? "Generuji..."
                : "Generovat"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
