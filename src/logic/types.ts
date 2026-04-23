export type Agent = {
  id: number
  name: string
  lastName: string
  issuance: number
  claims: number
  bonus: number
  pb?: number
}

export type Operation = {
  agent: number
  operation: string
  date: string // YYYY-MM-DD
  amount: number
}
