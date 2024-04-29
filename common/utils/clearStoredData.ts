import { clearIndexDB } from "./indexDb";

export function checkAndClearLocalStorage(pathname: string) {
  if (!pathname.includes('register')) {
    localStorage.clear();
    clearIndexDB();
  }
};