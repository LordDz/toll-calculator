import type { TollPassage } from '@/api/queries/toll'
import { formatDateTime } from '@/utils/date/formatDateTime'

interface PassagesTableProps {
  passages: TollPassage[]
}

export const PassagesTable = ({ passages }: PassagesTableProps) => (
  <div className="overflow-x-auto">
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
            <td className="py-3 pr-4 text-gray-300">
              {formatDateTime(p.timestamp)}
            </td>
            <td className="py-3 pr-4">{p.vehicleType}</td>
            <td className="py-3">
              {p.feeSek === 0 ? (
                <span className="text-emerald-400">Free</span>
              ) : (
                <span className="font-medium">{p.feeSek}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
