import axios from "axios";
import { PUBLIC_API_URL } from "$env/static/public";

export const axio = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

/** @type import("axios").AxiosInstance | null */
export let saxio = null;
/**
 * 
 * @param {string} token
 */
export function setSaxio(token) {
  saxio = axios.create({
    baseURL: PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
}
export function resetAxios() {
  saxio = null;
}

