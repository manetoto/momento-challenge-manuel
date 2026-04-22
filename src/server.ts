import { getAgents, showList } from './logic/agents'
import { getIssuance, getClaims, calculatePB, calculateSiniestralidad, calculateIssuance, calculateClaims, calculateBonus } from './logic/operations'

async function main () {
  const agents = await getAgents()
  const issuance = await getIssuance()
  const claims = await getClaims()

  for (const agent of agents) {
    agent.issuance = calculateIssuance(agent, issuance).toFixed(2)
    agent.claims = calculateClaims(agent, claims).toFixed(2)
    agent.bonus = calculateBonus(agent).toFixed(2)
  }

  showList(agents)
}

main()
