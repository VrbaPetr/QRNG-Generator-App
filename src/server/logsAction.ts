"use server";

const url = process.env.API_URL;

export async function logSignIn(id: string) {
  const res = await fetch(`${url}/access/login/user=${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return res.json();
}
export async function logSignOut(id: string) {
  const res = await fetch(`${url}/access/logout/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return res.json();
}
