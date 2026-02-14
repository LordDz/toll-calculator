import type { FeeRulesSummary } from '@/api/queries/toll/apiToll.types'

type RulesListProps = {
  rules: FeeRulesSummary
}

export const RulesList = ({ rules }: RulesListProps) => (
  <ul className="space-y-2 text-gray-300">
    <li>
      Fee between <strong className="text-white">{rules.minFeeSek}</strong> and{' '}
      <strong className="text-white">{rules.maxFeeSek} SEK</strong> depending on
      time of day.
    </li>
    <li>
      Maximum{' '}
      <strong className="text-white">{rules.maxPerDaySek} SEK</strong> per day.
    </li>
    <li>
      Charged at most once per hour; highest fee applies if multiple passages in
      the same hour.
    </li>
    <li>Fee-free: weekends and holidays.</li>
    <li>
      Fee-free vehicle types:{' '}
      <span className="text-cyan-300">
        {rules.freeVehicleTypes.join(', ')}
      </span>
    </li>
  </ul>
)
