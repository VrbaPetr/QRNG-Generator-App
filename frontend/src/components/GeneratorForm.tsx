"use client";
import { deactivateCode, insertCode } from "@/server/codeAction";
import { insertRecord } from "@/server/recordAction";
import { Program, User } from "@/utils/app-types";
import { generateRandomCode } from "@/utils/helper-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiRefreshCw } from "react-icons/fi";
import { z } from "zod";
import formSchema from "../utils/form-schemas/GeneratorForm-schema";
import DashboardInput from "./DashboardInput";

type FormValues = z.infer<typeof formSchema>;

type GeneratorFormProps = {
  user: User;
  programs: Program[];
  shouldClearForm?: boolean;
};

export default function GeneratorForm({
  user,
  programs,
  shouldClearForm = true,
}: GeneratorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [generatedCode, setGeneratedCode] = useState(
    () => localStorage.getItem("generatedCode") || ""
  );
  const [forceRender, setForceRender] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // load defaults including any hidden fields
  const loadSavedValues = (): Partial<FormValues> => {
    try {
      const raw = localStorage.getItem("generatorFormValues");
      if (raw) return JSON.parse(raw);
    } catch {}
    // make sure we supply the hidden fields too:
    return {
      program: "",
      student: "",
      pool_excluded: "",
      pool_range: "",
      result: "5",
      examiner: user.userName,
      exam: "SZZ",
    };
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadSavedValues(),
    mode: "onChange",
  });

  const watched = watch();
  useEffect(() => {
    localStorage.setItem("generatorFormValues", JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const code = localStorage.getItem("generatedCode") || "";
    setGeneratedCode(code);
  }, [forceRender]);

  const handleGenerateCode = async () => {
    setFormError(null);
    setIsGenerating(true);

    try {
      const isFormValid = await trigger();

      if (!isFormValid) {
        setFormError("Prosím vyplňte všechna požadovaná pole");
        return;
      }

      const code = generateRandomCode();
      localStorage.setItem("generatedCode", code);
      setGeneratedCode(code);

      const values = watch();
      const fd = new FormData();
      fd.append("value", code);
      fd.append("program", values.program);
      fd.append("student", values.student);
      fd.append("pool_excluded", values.pool_excluded || "");
      fd.append("pool_range", values.pool_range || "");
      fd.append("examiner", user.userName);
      fd.append("exam", values.exam || "SZZ");
      await insertCode(fd);
    } catch (error) {
      console.error("Error generating code:", error);
      setFormError("Nastala chyba při generování kódu");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const fd = new FormData();
      fd.append("program", data.program);
      fd.append("student", data.student);
      fd.append("pool_excluded", data.pool_excluded || "");
      fd.append("pool_range", data.pool_range || "");
      fd.append("examiner", user.userName);
      fd.append("result", "0");
      fd.append("exam", data.exam || "SZZ");

      const resp = await insertRecord(fd);
      setResult(resp);

      if (resp && shouldClearForm) {
        localStorage.removeItem("generatorFormValues");
        reset({
          program: "",
          student: "",
          pool_excluded: "",
          pool_range: "",
          result: "5",
          examiner: user.userName,
          exam: "SZZ",
        });
        setFormKey((k) => k + 1);
      }
    } catch (e) {
      console.error(e);
      setFormError("Nastala chyba při zpracování formuláře");
    } finally {
      setIsSubmitting(false);
      console.log(result);
    }
  };

  const handleFullReset = () => {
    localStorage.removeItem("generatorFormValues");
    reset({
      program: "",
      student: "",
      pool_excluded: "0",
      pool_range: "0",
      result: "5",
      examiner: user.userName,
      exam: "SZZ",
    });
    setResult(null);
    setFormError(null);
  };

  const handleResetCode = async () => {
    localStorage.removeItem("generatedCode");
    setGeneratedCode("");
    await deactivateCode(generatedCode);
    setForceRender((f) => f + 1);
  };

  return (
    <div className="max-w-md font-sans text-gray-700" key={formKey}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="program"
          control={control}
          render={({ field }) => (
            <DashboardInput
              label="Program"
              options={programs.map((p) => ({
                value: p.nazev,
                label: `${p.nazev} (${p.kod})`,
              }))}
              type="select"
              error={errors.program?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="student"
          control={control}
          render={({ field }) => (
            <DashboardInput
              label="Student"
              error={errors.student?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="pool_excluded"
          control={control}
          render={({ field }) => (
            <DashboardInput label="Vynechat otázky" {...field} />
          )}
        />
        <Controller
          name="pool_range"
          control={control}
          render={({ field }) => (
            <DashboardInput
              label="Počet otázek"
              error={errors.pool_range?.message}
              {...field}
            />
          )}
        />

        {/* hidden fields so Zod is happy */}
        <input type="hidden" {...register("exam")} />
        <input type="hidden" {...register("result")} />
        <input type="hidden" {...register("examiner")} />

        {formError && (
          <div className="text-red-500 text-sm py-2">{formError}</div>
        )}

        <div className="flex gap-2 my-4">
          <button
            type="button"
            onClick={handleFullReset}
            className="px-4 py-2 border rounded"
          >
            Reset formuláře
          </button>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 border border-[#E00234] text-[#E00234] rounded hover:bg-red-50 font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Generuji..." : "Generovat"}
          </button>

          <button
            type="button"
            onClick={handleGenerateCode}
            disabled={!!generatedCode || isGenerating}
            className="w-full p-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            {isGenerating ? "Generuji kód..." : "Generovat v jiném okně"}
          </button>
        </div>

        {generatedCode && (
          <div className="flex flex-col gap-3 w-full items-center mt-4">
            <div className="bg-[#E00234] text-white p-2 rounded-sm w-full">
              <div className="border p-2 rounded-sm">
                <p className="text-center font-medium text-lg">
                  Párovací kód:{" "}
                  <span className="font-bold">{generatedCode}</span>
                </p>
                <p className="text-center">druhé okno: /secondWindow</p>
              </div>

              <button
                type="button"
                onClick={handleResetCode}
                className="p-2 mt-2 w-full rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border border-gray-300 flex items-center justify-center gap-2"
                aria-label="Reset generated code"
              >
                Resetovat kód
                <FiRefreshCw />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
