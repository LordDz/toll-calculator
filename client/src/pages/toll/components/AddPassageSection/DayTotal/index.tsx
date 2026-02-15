type DayTotalProps = {
  sekToday: number | undefined
}

export const DayTotal = ({ sekToday }: DayTotalProps) => {
  if (sekToday == undefined) return null
  return (
    <p className="mt-2 text-sm text-text-secondary">
      Day total (once/hour, max 60 SEK):{' '}
      <span className="font-medium text-text-primary">{sekToday} SEK</span>
    </p>
  )
}
