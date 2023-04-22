export interface User {
  fullname: string
  email: string
  password?: string
  publicAddress?: string
  passwordConfirm?: string
  nin?: number
  role?: Array<string>
}

export enum Color {
  danger = 'danger'
}

export interface Asset {
  plotCoordinate: string
  city: string
  state: string
}

type Land = {
  land_id: number
  is_govt_approved: boolean
  ipfsHash: string
  current_owner: string
  previous_owners: string[]
  users?: Map<String, User>
  created_at: number
  approved_at: number
  fullname: string
  lat: string
  city: string
  lga: string
  long: string
  [index: number]: string | boolean | number
}

export type { Land }
