import { Agent } from './types'
import { readFromCSV } from './utils'

export async function getAgents () {
  const rows = await readFromCSV('../resources/agents.csv')
  return ((rows as any[]).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    lastName: String(row.lastName),
    issuance: 0,
    claims: 0,
    bonus: 0,
  })) as Agent[])
}

export function showList (agents: Agent[]) {
  const tab = '\t'
  console.log(`AGENTE${tab}NOMBRE${tab}APELLIDO${tab}EMISIÓN${tab}SINIESTROS${tab}BONO`)
  for (const agent of agents) {
    console.log(
      `${agent.id}${tab}${agent.name}${tab}${agent.lastName}${tab}${agent.issuance.toFixed(2)}${tab}${agent.claims.toFixed(2)}${tab}${agent.bonus.toFixed(2)}`
    )
  }
}
