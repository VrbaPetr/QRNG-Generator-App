"use server";

const url = process.env.API_URL;

export async function logSignIn(id: string) {
  await fetch(`${url}/access/login/user=${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
}
export async function logSignOut(id: string) {
  await fetch(`${url}/access/logout/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
}

export async function logsFull() {
  const res = await fetch(`${url}/logs/full`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return res.json();
}

export async function logsError() {
  const res = await fetch(`${url}/logs/error`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return res.json();
}

export async function logsActivity() {
  const res = await fetch(`${url}/logs/activity`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return res.json();
}

export async function logsAccess() {
  const res = await fetch(`${url}/logs/access`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return res.json();
}
