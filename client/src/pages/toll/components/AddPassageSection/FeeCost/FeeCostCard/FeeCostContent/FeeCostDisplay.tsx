import type { FeeCheckResult } from '@/api/queries/toll'

export interface FeeCostDisplayProps {
  data: FeeCheckResult | undefined
}

export const FeeCostDisplay = ({ data }: FeeCostDisplayProps) => {
  if (data === undefined) {
    return <span className="font-semibold">—</span>
  }
  if (data.isFree) {
    return (
      <>
        <span className="font-semibold">Fee-free</span>
        {data.reason && (
          <span className="ml-2">— {data.reason}</span>
        )}
      </>
    )
  }
  return (
    <>
    <span className="font-semibold">
      Fee: {data.feeSek} SEK
    </span>
    {data.reason && (
      <span className="ml-2">— {data.reason}</span>
    )}
    </>
  )
}
