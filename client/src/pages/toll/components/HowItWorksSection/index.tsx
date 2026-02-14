import { apiToll } from '@/api/queries/toll'
import { QueryWrapper } from '@/components/QueryWrapper/QueryWrapper'
import { TxtSectionTitle } from '@/components/text/MenuHeader'
import { useQuery } from '@tanstack/react-query'
import { RulesList } from './RulesList'

export const HowItWorksSection = () => {
  const rulesQuery = useQuery(apiToll.getFeeRules.get())

  return (
    <section className="bg-toll-section rounded-xl p-6">
      <TxtSectionTitle>How the toll system works</TxtSectionTitle>
      <QueryWrapper
        query={rulesQuery}
        loadingMessage="Loading rules…"
        noDataMessage="No fee rules available."
        messageClassName="text-text-secondary"
      >
        {(rules) => <RulesList rules={rules} />}
      </QueryWrapper>
    </section>
  )
}
