import { clearIndexDB } from "./indexDb";

export function checkAndClearLocalStorage(pathname: string) {
  if (!pathname.includes('register')) {
    localStorage.removeItem('propertyData');
    localStorage.removeItem('plans');
    localStorage.removeItem('creditCard');
    clearIndexDB();
  }
};