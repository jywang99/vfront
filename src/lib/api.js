import axios from "axios";
import { env } from '$env/dynamic/public'

export const axio = axios.create({
  baseURL: env.PUBLIC_API_URL,
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
    baseURL: env.PUBLIC_API_URL,
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
  * {{ meta: EntryMeta, path: string, files: string[], tags: Tag[], casts: Cast[], parent: Collection }}
  * Entry
  */

/**
  * @typedef
  * {{ id: number, name: string, pic?: string }}
  * PickerItemType
  */

/** @typedef {PickerItemType} Collection 
  * {{ id: number, name: string, desc?: string, created: string, parent?: number }}
  */

/** @typedef {PickerItemType} Tag
  * {{ id: number, name: string }}
  */

/** @typedef {PickerItemType} Cast
  * {{ id: number, name: string, pic: string }}
  */

/** @typedef
  * {{ total: number }}
  * PagingResp
  */

/** @typedef
  * {{ by?: string, desc: boolean, pageSize: number, offset: number, getTotal: boolean }}
  * PagingOpts
  */

