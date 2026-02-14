import { FeeCostCard } from './FeeCostCard'
import { FeeCostContent } from './FeeCostCard/FeeCostContent'
import type { FeeCostProps } from './index.types'

export const FeeCost = ({ data }: FeeCostProps) => (
  <FeeCostCard isFree={data?.isFree}>
    <FeeCostContent data={data} />
  </FeeCostCard>
)
