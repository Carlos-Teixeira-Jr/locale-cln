import { clearIndexDB } from "./indexDb";

export function checkAndClearLocalStorage(pathname: string) {
  console.log("🚀 ~ checkAndClearLocalStorage ~ pathname:", pathname)
  if (!pathname.includes('register')) {
    localStorage.removeItem('propertyData');
    localStorage.removeItem('plans');
    localStorage.removeItem('creditCard');
    clearIndexDB();
  }
};