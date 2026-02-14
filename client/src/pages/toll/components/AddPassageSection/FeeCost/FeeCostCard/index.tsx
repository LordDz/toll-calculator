import type { FeeCostCardProps } from './index.types'

const variantClassName = (isFree?: FeeCostCardProps['isFree']) =>
  isFree === undefined
    ? 'bg-stone-100/60 border border-stone-200 text-text-secondary'
    : isFree
      ? 'bg-emerald-100/80 border border-emerald-300 text-emerald-800'
      : 'bg-amber-100/80 border border-amber-300 text-amber-800'

export const FeeCostCard = ({ isFree, children }: FeeCostCardProps) => (
  <div
    className={`mt-4 min-h-14 p-4 rounded-lg transition-colors duration-300 ${variantClassName(isFree)}`}
  >
    {children}
  </div>
)
