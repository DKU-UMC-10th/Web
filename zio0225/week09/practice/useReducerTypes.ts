export interface CompanyState {
  department: string;
  error: string | null;
}

export type CompanyAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string }
  | { type: "RESET" };