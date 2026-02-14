import type { TxtSectionTitleProps } from './TxtSectionTitle.types'

export const TxtSectionTitle = ({ children }: TxtSectionTitleProps) => (
  <h2 className="text-xl font-semibold text-text-primary mb-4">{children}</h2>
)
