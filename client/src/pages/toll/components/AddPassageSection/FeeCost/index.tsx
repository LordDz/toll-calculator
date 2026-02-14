import type { FeeCheckResult } from '@/api/queries/toll'

interface FeeCostProps {
  data: FeeCheckResult
}

export const FeeCost = ({ data }: FeeCostProps) => (
  <div
    className={`mt-4 p-4 rounded-lg ${
      data.isFree
        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200'
        : 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
    }`}
  >
    {data.isFree ? (
      <>
        <span className="font-semibold">Fee-free</span>
        {data.reason && (
          <span className="ml-2">— {data.reason}</span>
        )}
      </>
    ) : (
      <span className="font-semibold">
        Fee: {data.feeSek} SEK
      </span>
    )}
  </div>
)
