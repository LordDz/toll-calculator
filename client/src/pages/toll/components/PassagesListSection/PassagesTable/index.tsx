import type { TollPassage } from '@/api/queries/toll'
import { formatDateTime } from '@/utils/date/formatDateTime'

interface PassagesTableProps {
  passages: TollPassage[]
}

export const PassagesTable = ({ passages }: PassagesTableProps) => (
  <div className="max-h-[min(24rem,60vh)] overflow-x-auto overflow-y-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-600 text-gray-400 text-sm">
          <th className="py-2 pr-4">Time</th>
          <th className="py-2 pr-4">Vehicle</th>
          <th className="py-2">Fee (SEK)</th>
        </tr>
      </thead>
      <tbody>
        {passages.map((p) => (
          <tr
            key={p.id}
            className="border-b border-slate-700/80 hover:bg-slate-700/30"
          >
            <td className="pl-1 py-3 pr-4 text-gray-300">
              {formatDateTime(p.timestamp)}
            </td>
            <td className="pl-1 py-3 pr-4">{p.vehicleType}</td>
            <td className="pl-1 py-3">
              {p.feeSek === 0 ? (
                <span className="pl-1 text-emerald-400">Free</span>
              ) : (
                <span className="pl-1 font-medium">{p.feeSek}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
