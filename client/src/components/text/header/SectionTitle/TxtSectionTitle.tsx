import type { TxtSectionTitleProps } from './TxtSectionTitle.types'

export const TxtSectionTitle = ({ children }: TxtSectionTitleProps) => (
  <h2 className="text-xl font-semibold text-white mb-4">{children}</h2>
)
