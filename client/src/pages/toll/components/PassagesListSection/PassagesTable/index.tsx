import type { PassagesTableProps } from './index.types'
import { formatDateTime } from '@/utils/date/formatDateTime'

export const PassagesTable = ({ passages }: PassagesTableProps) => (
  <div className="max-h-[min(24rem,60vh)] overflow-x-auto overflow-y-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-stone-300 text-text-secondary text-sm">
          <th className="py-2 pr-4">Time</th>
          <th className="py-2 pr-4">Vehicle</th>
          <th className="py-2">Fee (SEK)</th>
        </tr>
      </thead>
      <tbody>
        {passages.map((p) => (
          <tr
            key={p.id}
            className="border-b border-stone-200/80 hover:bg-stone-100/60"
          >
            <td className="pl-1 py-3 pr-4 text-text-primary">
              {formatDateTime(p.timestamp)}
            </td>
            <td className="pl-1 py-3 pr-4 text-text-primary">{p.vehicleType}</td>
            <td className="pl-1 py-3">
              {p.feeSek === 0 ? (
                <span className="pl-1 text-emerald-600">Free</span>
              ) : (
                <span className="pl-1 font-medium text-text-primary">{p.feeSek}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
