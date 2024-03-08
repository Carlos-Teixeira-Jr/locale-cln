import { useEffect } from "react";

export function verifyCookiesPolicy(setShowCookiesModal: (value: boolean) => void) {
  useEffect(() => {
    const cookiesPolicy = localStorage.getItem('locale.cookiesPolicy');
    if (cookiesPolicy === null || cookiesPolicy === 'false') {
      setShowCookiesModal(true);
    }
  }, []);
}