import Axios from 'axios';
import { parseCookies } from 'nookies';

export function getAPIClient(context?: any) {
  const { 'locale.token': token } = parseCookies(context);

  const Api = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    Api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return Api;
}
