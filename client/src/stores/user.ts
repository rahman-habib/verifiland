import type { User } from '@/stores/types'
import { useUIStore } from './ui'
import { API_URL } from './../services/config'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore({
  id: 'user',
  state: (): {
    user?: User | null
    accessToken?: string | null
    loading: boolean
    error?: any
    accounts: Array<User>
  } => ({
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    accounts: []
  }),
  getters: {},
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password })
        this.accessToken = response.data?.access_token
        await this.getProfile()
      } catch (error: any) {
        this.error = error.response.data
        throw error.response.data
      } finally {
        this.loading = false
      }
    },
    async loginWithAddress(publicAddress: string, signature: string) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/auth/login-ethereum`, {
          publicAddress,
          signature
        })
        this.accessToken = response.data?.access_token
        await this.getProfile()
      } catch (error: any) {
        this.error = error.response.data
        throw error.response.data
      } finally {
        this.loading = false
      }
    },
    async getUserByAddress(publicAddress: string) {
      useUIStore().showLoader()
      try {
        const response = await axios.get(`${API_URL}/user/address?publicAddress=` + publicAddress)
        return response.data
      } catch (error: any) {
        console.log(error)
        this.error = error.response.data
        throw error.response.data
      } finally {
        useUIStore().hideLoader()
      }
    },

    async getAllUsers() {
      useUIStore().showLoader()
      try {
        const response = await axios.get(`${API_URL}/user/all`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        this.accounts = response.data ?? []
        this.accounts = this.accounts.filter((account) => account.email != this.user?.email)
        console.log(this.user?.email, response.data)
      } catch (error: any) {
        console.log(error)
      } finally {
        useUIStore().hideLoader()
      }
    },

    async register(data: User) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/auth/register`, data)
        this.user = response.data
        if (this.user?.publicAddress) {
          await this.loginWithAddress(this.user.publicAddress, '')
        } else if (this.user && data.password) {
          await this.login(this.user.email, data.password)
        }
      } catch (error: any) {
        this.error = error.response.data
        throw error.response.data
      } finally {
        this.loading = false
      }
    },
    async getProfile() {
      this.user = null
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        this.user = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.user = null
      this.accessToken = null

      router.push('/')
    },
    isAdmin() {
      if (this.user && Array.isArray(this.user.role)) {
        return this.user.role.includes('ADMIN')
      }

      return false
    }
  },
  persist: true
})
