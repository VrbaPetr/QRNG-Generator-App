// GeneratorForm.tsx

import { insertRecord } from "@/server/recordAction";
import { Program, User } from "@/utils/app-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import formSchema from "../utils/form-schemas/GeneratorForm-schema";
import DashboardInput from "./DashboardInput";
import { useState, useEffect } from "react";
import { insertCode } from "@/server/codeAction";
import { generateRandomCode } from "@/utils/helper-functions";

type FormValues = z.infer<typeof formSchema>;

type GeneratorFormProps = {
  user: User;
  programs: Program[];
  shouldClearForm?: boolean;
};

export default function GeneratorForm({
  programs,
  shouldClearForm = true,
}: GeneratorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");

  const loadSavedValues = () => {
    try {
      const savedValues = localStorage.getItem("generatorFormValues");
      if (savedValues) {
        return JSON.parse(savedValues);
      }
    } catch (error) {
      console.error("Error loading saved form values:", error);
    }

    return {
      examYear: "2025/26",
      program: "",
      student: "",
      pool_excluded: "",
      pool_range: "",
      result: "5",
      examiner: "EX0ZK",
      exam: "SZZ",
    };
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadSavedValues(),
  });

  const formValues = watch();
  useEffect(() => {
    localStorage.setItem("generatorFormValues", JSON.stringify(formValues));
  }, [formValues]);

  const handleGenerateCode = async () => {
    const code = generateRandomCode();

    console.log("Generated code:", code);
    setGeneratedCode(code);
    await insertCode(code);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form data:", data);

      const formData = new FormData();
      formData.append("examYear", data.examYear || "2025/26");
      formData.append("program", data.program);
      formData.append("student", data.student);
      formData.append("pool_excluded", data.pool_excluded || "");
      formData.append("pool_range", data.pool_range || "");
      formData.append("examiner", data.examiner);
      formData.append("result", data.result || "5");
      formData.append("exam", data.exam || "SZZ");

      const response = await insertRecord(formData);
      console.log("Insert result:", response);
      setResult(response);

      if (response && shouldClearForm) {
        localStorage.removeItem("generatorFormValues");
        reset({
          examYear: "2025/26",
          program: "",
          student: "",
          pool_excluded: "",
          pool_range: "",
          result: "5",
          examiner: "EX0ZK",
          exam: "SZZ",
        });
        // Force form to re-render with new values
        setFormKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFullReset = () => {
    localStorage.removeItem("generatorFormValues");
    reset({
      examYear: "2025/26",
      program: "",
      student: "",
      pool_excluded: "",
      pool_range: "",
      result: "5",
      examiner: "EX0ZK",
      exam: "SZZ",
    });
    setResult(null);
  };

  return (
    <div className="max-w-md font-sans text-gray-700" key={formKey}>
      <button onClick={async () => await insertCode("ZKZK")}>generate </button>
      {result ? (
        <div className="p-4 border border-green-300 bg-green-50 rounded-md mb-4">
          <p className="font-medium text-green-800">Otázka vygenerována!</p>
          <p className="text-lg font-bold text-green-900 mt-2">
            Číslo otázky: {"N/A"}
          </p>
          <button
            onClick={() => setResult(null)}
            className="mt-3 px-3 py-1 bg-white border border-green-400 text-green-600 rounded hover:bg-green-50"
          >
            Zpět
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="examYear"
            control={control}
            render={({ field }) => (
              <DashboardInput
                label="Státní Závěrečné Zkoušky 2025/26"
                type="text"
                error={errors.examYear?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="program"
            control={control}
            render={({ field }) => (
              <DashboardInput
                label="Program"
                options={programs.map((program) => ({
                  value: program.nazev,
                  label: program.nazev,
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

          <div className="text-center mb-4 flex justify-between">
            <button
              type="button"
              className="text-red-600 text-sm"
              onClick={handleFullReset}
            >
              reset všeho
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 border border-[#E00234] text-[#E00234] rounded hover:bg-red-50 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {generatedCode
                ? "Uložit"
                : isSubmitting
                ? "Generuji..."
                : "Generovat"}
            </button>

            <button
              type="button"
              className="w-full p-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-50 font-medium mt-2"
              onClick={() => handleGenerateCode()}
            >
              Generovat v jiném okně
            </button>
            <div>
              {generatedCode && (
                <div className="bg-[#E00234] text-white p-2 mt-4 rounded-sm">
                  <p className="text-center font-medium text-lg  ">
                    Párovací kód:{" "}
                    <span className="font-bold  ">{generatedCode}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
