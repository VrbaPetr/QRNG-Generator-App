import { LogEntry } from "./app-types";

export function getRandomNumber(
  min: number,
  max: number,
  exclude: number[]
): number {
  if (min > max) {
    throw new Error("Min should be less than or equal to max.");
  }

  const possibleNumbers = [];
  for (let i = min; i <= max; i++) {
    if (!exclude.includes(i)) {
      possibleNumbers.push(i);
    }
  }

  if (possibleNumbers.length === 0) {
    throw new Error("No available numbers to select.");
  }

  const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
  return possibleNumbers[randomIndex];
}

export function decodeUserInfo(data: string, userTicker: string) {
  const result = data ? JSON.parse(atob(data)) : null;

  return {
    role: result.stagUserInfo[0].role,
    roleName: result.stagUserInfo[0].roleNazev,
    userName: result.stagUserInfo[0].userName,
    email: result.stagUserInfo[0].email,

    ticket: userTicker,
  };
}

export const exportToCSV = (
  filteredLogData: LogEntry[],
  activeLogType: string
) => {
  if (!filteredLogData.length) return;

  try {
    const allKeys = new Set<string>();
    filteredLogData.forEach((log) => {
      Object.keys(log).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys).sort();

    let csvContent = headers.join(",") + "\n";

    filteredLogData.forEach((log) => {
      const row = headers.map((header) => {
        const value = log[header as keyof LogEntry];
        if (value === null || value === undefined) {
          return "";
        } else if (typeof value === "object") {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          return typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : String(value);
        }
      });

      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${activeLogType}_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    alert("Failed to export CSV. Please try again.");
  }
};

export function exportData<T extends Record<string, unknown>>({
  data,
  fields,
  filename,
  format = "csv",
  formatTimestamp = true,
}: {
  data: T[];
  fields?: string[];
  filename: string;
  format?: "csv" | "json";
  formatTimestamp?: boolean;
}): void {
  if (!data.length) return;

  try {
    const fieldsToExport = fields?.length
      ? fields
      : Object.keys(data[0]).filter((key) => key !== "__typename");

    if (format === "csv") {
      let csvContent = fieldsToExport.join(",") + "\n";

      data.forEach((item) => {
        const row = fieldsToExport.map((field) => {
          const value = item[field];

          if (
            formatTimestamp &&
            (field === "timestamp" ||
              field === "date" ||
              field === "created_at") &&
            value
          ) {
            try {
              const date = new Date(value as string);
              if (!isNaN(date.getTime())) {
                const formattedDate = date.toLocaleString("cs-CZ", {
                  dateStyle: "short",
                  timeStyle: "short",
                });
                return `"${formattedDate}"`;
              }
            } catch {}
          }

          if (value === null || value === undefined) {
            return "";
          } else if (typeof value === "object") {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } else {
            return typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : String(value);
          }
        });

        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `${filename}.csv`);
    } else if (format === "json") {
      const filteredJson = data.map((item) => {
        const filteredItem: Partial<T> = {};
        const fieldsToExport = fields || getAvailableFields(data);
        fieldsToExport.forEach((field) => {
          if (field in item) {
            (filteredItem as Record<string, unknown>)[field] = item[field];
          }
        });
        return filteredItem;
      });

      const jsonString = JSON.stringify(filteredJson, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      downloadFile(blob, `${filename}.json`);
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    alert("Nepodařilo se exportovat data. Zkuste to prosím znovu.");
  }
}

export function formatTimestamp(
  timestamp: string | number | Date,
  locale = "cs-CZ"
): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString(locale, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return String(timestamp);
  }
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface ExportOptions {
  fields: string[];
  format: "csv" | "json";
}

export function getAvailableFields<T extends Record<string, unknown>>(
  data: T[]
): string[] {
  if (!data.length) return [];

  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "__typename") {
        allKeys.add(key);
      }
    });
  });

  return Array.from(allKeys).sort();
}
