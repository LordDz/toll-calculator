import type { FeeCheckResult } from '@/api/queries/toll'
import { useEffect, useState } from 'react'
import type { FeeCostContentProps } from './index.types'
import { FeeCostDisplay } from './FeeCostDisplay'

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
      <FeeCostDisplay data={displayData} />
    </div>
  )
}
