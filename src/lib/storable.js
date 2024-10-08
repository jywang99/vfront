import { writable } from 'svelte/store'
import { resetAxios, setSaxio } from './api'

/**
 * @typedef {{ token: string, name: string }} User
 */

const stored = localStorage.user
export const localUser = writable(stored ? JSON.parse(stored) : null)

localUser.subscribe(value => {
  if (!value) {
    localStorage.removeItem('user')
    resetAxios()
    return
  }
  localStorage.user = JSON.stringify(value)
  setSaxio(value.token)
})

