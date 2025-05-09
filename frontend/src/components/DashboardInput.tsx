import React from "react";

type Option = {
  value: string;
  label: string;
};

interface DashboardInputProps {
  label: string;
  type?: "text" | "select";
  options?: Option[];
  error?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onBlur?: () => void;
  name?: string;
}

export default function DashboardInput({
  label,
  type = "text",
  options = [],
  error,
  ...rest
}: DashboardInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      {type === "select" ? (
        <select
          className={`w-full p-2 border rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...rest}
        >
          <option value="">Vyberte...</option>
          {options.map((option, index) => (
            <option key={`${option.value}+${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className={`w-full p-2 border rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...rest}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
