import { toast } from "react-toastify";
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from "../common/utils/toasts";

export const sendRequest = async (url: string, method: string, body: any) => {
  try {
    toast.loading('Enviando...');
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      toast.dismiss();
      return await response.json();
    } else {
      toast.dismiss();
      showErrorToast(ErrorToastNames.EmailNotFound)
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};