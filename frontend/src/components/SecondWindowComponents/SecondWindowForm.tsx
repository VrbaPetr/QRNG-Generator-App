"use client";
import { deactivateCode, getCode } from "@/server/codeAction";
import { insertRecord } from "@/server/recordAction";
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
  const [activeCode, setActiveCode] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log(code);

    const formData = new FormData(e.currentTarget);
    const entryCode = formData.get("code") as string;
    setCode(entryCode);

    if (!entryCode) {
      setError("Prosím vyplňte kód");
      setIsLoading(false);
      return;
    }

    console.log("Submitting code:", code);
    try {
      const response = await getCode(code);
      console.log("Response:", response);

      if (response) {
        const isActive = response.is_active === 1;
        setActiveCode(isActive);

        if (!isActive) {
          setError("Kód již není aktivní");
          setIsLoading(false);
          return;
        }

        setCode(entryCode);
        setRecord(response);
        console.log("Record:", record);

        setGenerate(true);
      } else {
        setError("Neplatný kód");
      }
    } catch (err) {
      console.error("Error fetching code:", err);
      setError("Chyba při ověřování kódu");
    } finally {
      setIsLoading(false);
      await deactivateCode(code);
    }
  };

  const handleGenerateAgain = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      setLockBtn(true);

      const number = Math.floor(Math.random() * 100) + 1;
      const numberString = number.toString();

      const formData = new FormData();

      formData.append("program", record.program);
      formData.append("student", record.student);
      formData.append("pool_excluded", record.pool_excluded || "0");
      formData.append("pool_range", record.pool_range.toString());
      formData.append("examiner", record.examiner);
      formData.append("result", "0");
      formData.append("exam", record.exam || "SZZ");

      await insertRecord(formData);
      console.log(code);

      setTimeout(() => {
        setLockBtn(false);
      }, 60000);

      setQuestionNumber(numberString);
    } catch (err) {
      console.error("Error generating number:", err);
      setGenerationError("Nepodařilo se vygenerovat číslo");

      const fallbackNumber = Math.floor(Math.random() * 100) + 1;
      setQuestionNumber(fallbackNumber.toString());
    } finally {
      setIsGenerating(false);
      await deactivateCode(code);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      {!generate || !activeCode ? (
        <div className="w-full max-w-md border border-slate-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Zadejte kod
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
              className="w-full bg-[#E00234] text-white py-3 rounded-md hover:bg-[#E00234]/80 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="p-2 border border-[#E00234] text-[#E00234] rounded hover:bg-red-50 font-medium w-full disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
            >
              {lockBtn
                ? "Počkejte 60 sekund"
                : isGenerating
                ? "Generuji..."
                : "Generovat "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
