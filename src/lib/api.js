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

/** @typedef
  * {{ id: number, name: string, desc: string, casts: number[], tags: number[], parentId: number, thumbStatic: string, thumbDynamic: string[], created: string, updated: string, aired: string }}
  * EntryMeta
  */

/** @typedef
  * {{ meta: EntryMeta, path: string, files: string[] }}
  * Entry
  */

/** @typedef
  * {{ id: number, name: string, desc: string, created: string, parent: number }}
  * Collection
  */

/** @typedef
  * {{ id: number, name: string }}
  * Tag
  */

/** @typedef
  * {{ id: number, name: string, pic: string }}
  * Cast
  */

/** @typedef
  * {{ total: number }}
  * PagingResp
  */

/** @typedef
  * {{ by?: string, desc: boolean, pageSize: number, offset: number, getTotal: boolean }}
  * PagingOpts
  */

