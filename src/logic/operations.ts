import { Agent, Operation } from './types'
import { readFromCSV } from './utils'

const SEMESTER_2025_START = '2025-01-01'
const SEMESTER_2025_END = '2025-06-30'

function isWithinSemester2025 (date: string) {
  return date >= SEMESTER_2025_START && date <= SEMESTER_2025_END
}

export async function getIssuance () {
  const rows = await readFromCSV('../resources/issuance.csv')
  const operations = (rows as any[]).map((row) => ({
    agent: Number(row.agent),
    operation: String(row.operation),
    date: String(row.date),
    amount: Number(row.amount),
  })) as Operation[]
  return operations.filter((op) => isWithinSemester2025(op.date))
}

export async function getClaims () {
  const rows = await readFromCSV('../resources/claims.csv')
  const operations = (rows as any[]).map((row) => ({
    agent: Number(row.agent),
    operation: String(row.operation),
    date: String(row.date),
    amount: Number(row.amount),
  })) as Operation[]
  return operations.filter((op) => isWithinSemester2025(op.date))
}

export function calculateIssuance (agent: Agent, operations: Operation[]) {
  let issuance = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === 'issuance') issuance += op.amount
  }
  return issuance
}

export function calculateClaims (agent: Agent, operations: Operation[]) {
    let claims = 0
    let recovery = calculateOperation(agent, operations,"recovery")
    let reserve =  calculateOperation(agent, operations, "reserve")
    let adjust = calculateOperation(agent, operations, "adjust")
    let deductible = calculateOperation(agent, operations, "deductible")
    claims = (reserve + adjust) - (deductible - recovery)
    return claims
}

export function calculateOperation (agent: Agent, operations: Operation[], typeOperation: String) {
  let amountOperations = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === typeOperation) amountOperations += op.amount
  }
  return amountOperations
}

export function calculateAccidentRate (ms: number, me: number) {
  return (ms / me) * 100
}

export function calculatePB (ms: number, me: number) {
  const accidentRate = calculateAccidentRate(ms, me)
  const isAccidentRate = accidentRate <= 65

  if (me < 3500) return isAccidentRate ? 4 : 0
  if (me < 5000) return isAccidentRate ? 5 : 0
  if (me < 5500) return isAccidentRate ? 6 : 1
  if (me <= 6000) return isAccidentRate ? 8 : 2
  return isAccidentRate ? 10 : 3
}

export function calculateBonus (agent: Agent) {
  let pb = calculatePB(agent.claims, agent.issuance)
  return (agent.issuance* pb) / 100
}
