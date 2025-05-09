"use client";
import { getCode } from "@/server/codeAction";
import { insertRecord } from "@/server/recordAction";
import { Code } from "@/utils/app-types";
import { useState } from "react";

export function SecondWindowForm() {
  const [generate, setGenerate] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lockBtn, setLockBtn] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    if (!code) {
      setError("Prosím vyplňte kód");
      setIsLoading(false);
      return;
    }

    console.log("Submitting code:", code);
    try {
      const response: Code | null = await getCode(code);
      console.log("Response:", response);

      if (response?.value && response.is_active) {
        setQuestionNumber("0");
        setGenerate(true);
      } else {
        setError("Neplatný kód");
      }
    } catch (err) {
      console.error("Error fetching code:", err);
      setError("Chyba při ověřování kódu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      setLockBtn(true);

      // Generate random number first
      const number = Math.floor(Math.random() * 100) + 1;
      const numberString = number.toString();

      // Create form data with all required fields properly formatted
      const formData = new FormData();
      formData.append("examiner", "SYNC_GEN");
      formData.append("student", "SYNC_GEN");
      formData.append("program", "SYNC_GEN");
      formData.append("exam", "SZZ"); // Using standard exam code
      formData.append("pool_range", "20"); // Using valid number
      formData.append("pool_excluded", "0"); // Using valid number
      formData.append("result", numberString);
      formData.append("examYear", "2025/26"); // Adding required examYear

      // Save record to database
      const recordResult = await insertRecord(formData);
      console.log("Record saved:", recordResult);

      setTimeout(() => {
        setLockBtn(false);
      }, 60000);

      // Update UI with new number
      setQuestionNumber(numberString);
    } catch (err) {
      console.error("Error generating number:", err);
      setGenerationError("Nepodařilo se vygenerovat číslo");
      // We still want to show a random number even if the DB save fails
      const fallbackNumber = Math.floor(Math.random() * 100) + 1;
      setQuestionNumber(fallbackNumber.toString());
    } finally {
      setIsGenerating(false);
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
                placeholder="Zadejte kód"
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
      )}
    </div>
  );
}
