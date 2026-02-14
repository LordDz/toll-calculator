import type { ChangeEvent } from 'react'

export type SelectProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: readonly string[]
  label?: string
  className?: string
}

const inputClassName =
  'px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 min-w-[140px]'

export const Select = ({
  value,
  onChange,
  options,
  label,
  className,
}: SelectProps) => (
  <label className="flex flex-col gap-1">
    {label && <span className="text-sm text-gray-400">{label}</span>}
    <select
      value={value}
      onChange={onChange}
      className={className ?? inputClassName}
    >
      {options.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  </label>
)
