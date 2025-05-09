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
