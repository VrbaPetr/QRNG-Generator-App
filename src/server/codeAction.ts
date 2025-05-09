"use server";

const url = process.env.API_URL;

export async function insertCode(value: string) {
  console.log("Inserting code:", value);
  const res = await fetch(`${url}/sync_code/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      value,
    }),
  });

  if (!res.ok) throw new Error("Failed to insert sync code");
  return res.json();
}

export async function getCode(value: string) {
  console.log(url);
  const res = await fetch(`${url}/sync_code/read/${value}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch sync code");
  }

  return await res.json();
}

export async function deactivateCode(value: string) {
  const res = await fetch(`${url}/sync_code/deactivate/${value}`, {
    method: "GET",
  });

  return res.json();
}
