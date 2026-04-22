import { Agent, Operation } from './types'
import { readFromCSV } from './utils'

export async function getIssuance () {
  const operations = await readFromCSV('../resources/issuance.csv')
  return operations
}

export async function getClaims () {
  const operations = await readFromCSV('../resources/claims.csv')
  return operations
}

export function calculateIssuance (agent: Agent, operations: Operation[]) {
  let issuance = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === "issuance") issuance += Number(op.amount)
  }
  return issuance
}


export function calculateClaims (agent: Agent, operations: Operation[]) {
    let claims = 0
    let recovery = calculateRecovery(agent, operations)
    let reserve =  calculateReserve(agent, operations)
    let adjust = calculateAdjust(agent, operations)
    let deductible = calculateDeductible(agent, operations)
    claims = (reserve + adjust) - (deductible - recovery)
    return claims
}

export function calculateReserve (agent: Agent, operations: Operation[]) {
  let claims = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === 'reserve') claims += Number(op.amount)
  }
  return claims
}

export function calculateRecovery (agent: Agent, operations: Operation[]) {
  let claims = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === "recovery") claims += Number(op.amount)
  }
  return claims
}

export function calculateAdjust (agent: Agent, operations: Operation[]) {
  let claims = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === "adjust") claims += Number(op.amount)
  }
  return claims
}

export function calculateDeductible (agent: Agent, operations: Operation[]) {
  let claims = 0
  for (const op of operations) {
    if (op.agent === agent.id && op.operation === "deductible") claims += Number(op.amount)
  }
  return claims
}

export function calculateSiniestralidad (ms: number, me: number) {
  return (ms / me) * 100
}

export function calculatePB (ms: number, me: number) {
  let porcentaje = 0
  let siniestralidad = calculateSiniestralidad(ms, me)
  console.log("siniestralidad: " + siniestralidad)
  if(me <= 3500 && siniestralidad <= 65){
    porcentaje = 4
  }
  if((me >= 3500 && me <= 5000) && siniestralidad <= 65){
    porcentaje = 5
  }
  if((me >= 5000 && me <= 5500) && siniestralidad <= 65){
    porcentaje = 6
  }
  if((me >= 5500 && me <= 6000) && siniestralidad <= 65){
    porcentaje = 8
  }
  if(me > 6000 && siniestralidad <= 65){
    porcentaje = 10
  }
  
  if(me <= 3500 && siniestralidad > 65){
    porcentaje = 0
  }
  if((me >= 3500 && me <= 5000) && siniestralidad > 65){
    porcentaje = 0
  }
  if((me >= 5000 && me <= 5500) && siniestralidad > 65){
    porcentaje = 1
  }
  if((me >= 5500 && me <= 6000) && siniestralidad > 65){
    porcentaje = 2
  }
  if(me > 6000 && siniestralidad > 65){
    porcentaje = 3
  }
  console.log("porcentaje: " + porcentaje)
  return porcentaje
}

export function calculateBonus (agent: Agent) {
  let pb = calculatePB(agent.claims, agent.issuance)
  return (agent.issuance* pb) / 100
}
