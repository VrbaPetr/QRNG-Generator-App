"use server";

const url = process.env.API_URL;

import { revalidatePath } from "next/cache";

export async function getRecords() {
  const res = await fetch(`${url}/records/all_records`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch records");
  }

  return res.json();
}

export async function insertRecord(form: FormData) {
  const poolExcludedRaw = form.get("pool_excluded");
  const poolExcluded = poolExcludedRaw ? String(poolExcludedRaw) : "0";

  const randomNumber = Math.floor(
    Math.random() * Number(form.get("pool_range"))
  );

  const payload = {
    examiner: form.get("examiner"),
    student: form.get("student"),
    program: form.get("program"),
    exam: form.get("exam"),
    result: randomNumber,
    pool_range: Number(form.get("pool_range")),
    pool_excluded: poolExcluded,
  };
  console.log(payload);

  const res = await fetch(`${url}/records/insert_record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Insert failed");

  const data = await res.json();
  console.log("INSERTED", data);

  revalidatePath("/dashboard");

  return data;
}

export async function getRecordById(id: number) {
  const res = await fetch(`${url}/records/${id}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export async function getExaminerRecords(id: number) {
  const res = await fetch(`${url}/records/examiner_records/${id}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}
