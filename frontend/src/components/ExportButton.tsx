"use client";

import { useState, useRef, useEffect } from "react";
import { BiDownload, BiX } from "react-icons/bi";
import { getAvailableFields, exportData } from "@/utils/utils-functions";

interface ExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  showExportButton?: boolean;
  className?: string;
  iconOnly?: boolean;
  popupPosition?: "right" | "left";
}

export function ExportButton<T extends Record<string, unknown>>({
  data,
  filename,
  showExportButton = true,
  className = "p-2 border text-[#E00234] rounded hover:bg-red-50 font-medium flex items-center",
  iconOnly = false,
  popupPosition = "right",
}: ExportButtonProps<T>) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const availableFields = getAvailableFields(data);

  const toggleFieldSelection = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const toggleAllFields = () => {
    if (selectedFields.length === availableFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields([...availableFields]);
    }
  };

  const quickExport = () => {
    exportData({
      data,
      filename: `${filename}_${new Date().toISOString().split("T")[0]}`,
      format: "csv",
    });
  };

  const exportWithOptions = () => {
    exportData({
      data,
      fields: selectedFields.length > 0 ? selectedFields : undefined,
      filename: `${filename}_${new Date().toISOString().split("T")[0]}`,
      format: exportFormat,
    });
    setShowExportOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowExportOptions(false);
      }
    };

    if (showExportOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportOptions]);

  if (!showExportButton || data.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowExportOptions(!showExportOptions)}
        className={className}
        title="Export dat"
      >
        <BiDownload size={21} />
        {!iconOnly && <span className="ml-1 hidden sm:inline">Export</span>}
      </button>

      {showExportOptions && (
        <div
          ref={popupRef}
          className={`absolute z-30 p-4 border rounded-md bg-white shadow-lg w-80 ${
            popupPosition === "right" ? "right-0" : "left-0"
          } top-full mt-1`}
          style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          <button
            onClick={() => setShowExportOptions(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1"
            aria-label="Zavřít"
          >
            <BiX size={20} />
          </button>

          <h3 className="font-medium mb-2">Možnosti exportu</h3>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Pole k exportu:</label>
              <button
                onClick={toggleAllFields}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedFields.length === availableFields.length
                  ? "Odznačit vše"
                  : "Vybrat vše"}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`field-${field}-${filename}`}
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleFieldSelection(field)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`field-${field}-${filename}`}
                    className="text-sm"
                  >
                    {field}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedFields.length === 0
                ? "Žádná pole nevybrána (exportují se všechna pole)"
                : `${selectedFields.length} polí vybráno`}
            </div>
          </div>

          <div className="mb-3">
            <label className="font-medium">Formát exportu:</label>
            <div className="flex mt-1">
              <label className="mr-4 flex items-center">
                <input
                  type="radio"
                  name={`exportFormat-${filename}`}
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={() => setExportFormat("csv")}
                  className="mr-1"
                />
                CSV
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`exportFormat-${filename}`}
                  value="json"
                  checked={exportFormat === "json"}
                  onChange={() => setExportFormat("json")}
                  className="mr-1"
                />
                JSON
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={quickExport}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Rychlý export CSV
            </button>
            <button
              onClick={exportWithOptions}
              className="px-4 py-2 bg-[#E00234] text-white rounded hover:bg-red-700"
            >
              Exportovat {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
