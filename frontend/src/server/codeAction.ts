"use server";

import { RecordItem } from "@/utils/app-types";

const url = process.env.API_URL;

export async function insertCode(formData: FormData) {
  const poolExcludedRaw = formData.get("pool_excluded");
  const poolExcluded = poolExcludedRaw ? String(poolExcludedRaw) : "0";

  const payload = {
    record_id: 4,
    value: formData.get("value"),
    examiner: formData.get("examiner"),
    student: formData.get("student"),
    program: formData.get("program"),
    exam: formData.get("exam"),
    pool_range: Number(formData.get("pool_range")),
    pool_excluded: poolExcluded,
  };
  console.log(payload);

  const res = await fetch(`${url}/temp/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create temp");
  return res.json();
}

export async function getCode(value: string) {
  console.log(url);
  const res = await fetch(`${url}/temp/read/${value}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch temp code");
  }

  return (await res.json()) as RecordItem;
}

export async function deactivateCode(value: string) {
  await fetch(`${url}/temp/deactivate/${value}`, {
    method: "GET",
  });
}
