import type { FeeCheckResult } from '@/api/queries/toll'
import { useEffect, useState } from 'react'
import type { FeeCostContentProps } from './index.types'

const renderContent = (data: FeeCheckResult | undefined) =>
  data === undefined ? (
    <span className="font-semibold">—</span>
  ) : data.isFree ? (
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
  )

export const FeeCostContent = ({ data }: FeeCostContentProps) => {
  const [displayData, setDisplayData] = useState<FeeCheckResult | undefined>(data)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (data === displayData) return
    setIsVisible(false)
    const startTransition = setTimeout(() => {
      setDisplayData(data)
      setIsVisible(true)
    }, 120)
    return () => clearTimeout(startTransition)
  }, [data, displayData])

  return (
    <div
      className="transition-opacity duration-300 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {renderContent(displayData)}
    </div>
  )
}
