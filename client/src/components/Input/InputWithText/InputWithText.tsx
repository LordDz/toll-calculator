import type { InputWithTextProps } from './InputWithText.types'

const inputClassName =
  'px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent'

export const InputWithText = ({
  label,
  className,
  labelClassName = 'text-sm text-gray-400',
  ...inputProps
}: InputWithTextProps) => (
  <label className="flex flex-col gap-1">
    <span className={labelClassName}>{label}</span>
    <input
      {...inputProps}
      className={className ?? inputClassName}
    />
  </label>
)
