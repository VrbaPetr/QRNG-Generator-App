"use server";

export async function getOboryStudijnihoProgramu() {
  "use server";

  try {
    const endpoint =
      "https://stag-ws.jcu.cz/ws/services/rest2/programy/getStudijniProgramy";

    const urlParams = new URLSearchParams({
      outputFormat: "JSON",
      fakulta: "FPR",
      pouzePlatne: "true",
    });

    const response = await fetch(`${endpoint}?${urlParams.toString()}`, {
      cache: "no-store",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`STAG API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching study programs:", error);
    throw error;
  }
}
