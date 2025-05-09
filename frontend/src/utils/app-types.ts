export type User = {
  userName: string;
  email: string;
  ticket: string;
  role: string;
};

export type Program = {
  nazev: string;
  fakulta: string;
  id: number;
  zkratka: string;
};

export type StagPrograms = {
  programInfo: Program[];
};

export type RecordItem = {
  id: number;
  examiner: string;
  student: string;
  program: string;
  exam: string;
  pool_range: number;
  pool_excluded: string;
  result: number;
  timestamp: string; // ISO 8601 string from MySQL datetime/timestamp
};

export type Code = {
  id: number;
  is_active: boolean;
  value: string;
};
