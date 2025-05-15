export type User = {
  userName: string;
  email: string;
  ticket: string;
  role: string;
};

export type Program = {
  nazev: string;
  fakulta: string;
  kod: string;
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
  is_active?: 1 | 0;
};

export type Code = {
  id: number;
  is_active: boolean;
  value: string;
};
export type LogTypeFilter = "full" | "error" | "activity" | "access";

export type UserRoles = "AD" | "ST" | "VY";

export type LogType = "full" | "error" | "activity" | "access";

export type LogEntry = {
  id: number;
  timestamp: string;
  source_ip: string;
  endpoint: string;
  type: string;
  http_status: number;
  operation: string;
  description: string;
};
