import Cookies from "js-cookie";
import { useEffect } from "react";

export function verifyCookiesPolicy(setShowCookiesModal: (value: boolean) => void) {
  useEffect(() => {
    const cookiesPolicy = Cookies.get('locale.cookiesPolicy');
    if (cookiesPolicy === null || cookiesPolicy === 'false') {
      setShowCookiesModal(true);
    }
  }, []);
}