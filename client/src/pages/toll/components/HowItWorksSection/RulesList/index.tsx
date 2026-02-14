import type { RulesListProps } from './index.types'

export const RulesList = ({ rules }: RulesListProps) => (
  <ul className="space-y-2 text-text-primary">
    <li>
      Fee between <strong>{rules.minFeeSek}</strong> and{' '}
      <strong>{rules.maxFeeSek} SEK</strong> depending on
      time of day.
    </li>
    <li>
      Maximum{' '}
      <strong>{rules.maxPerDaySek} SEK</strong> per day.
    </li>
    <li>
      Charged at most once per hour; highest fee applies if multiple passages in
      the same hour.
    </li>
    <li>Fee-free: weekends and holidays.</li>
    <li>
      Fee-free vehicle types:{' '}
      <span className="text-cyan-700">
        {rules.freeVehicleTypes.join(', ')}
      </span>
    </li>
  </ul>
)
