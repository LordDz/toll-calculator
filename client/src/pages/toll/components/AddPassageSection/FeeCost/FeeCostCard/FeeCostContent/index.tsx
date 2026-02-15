import type { FeeCheckResult } from '@/api/queries/toll'
import { useEffect, useState } from 'react'
import { FeeCostDisplay } from './FeeCostDisplay'
import type { FeeCostContentProps } from './index.types'

const skipUpdate = (data: FeeCheckResult | undefined, displayData: FeeCheckResult | undefined) => {
  if (!data) return true;
  if (!displayData) return false;
  return data.feeSek === displayData.feeSek && data.isFree === displayData.isFree && data.reason === displayData.reason;
}

export const FeeCostContent = ({ data }: FeeCostContentProps) => {
  const [displayData, setDisplayData] = useState<FeeCheckResult | undefined>(data)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (skipUpdate(data, displayData)) return;

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
      <FeeCostDisplay data={displayData} />
    </div>
  )
}
