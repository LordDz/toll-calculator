import type { TxtParagraphProps } from './TxtParagraph.types'

export const TxtParagraph = ({ children, className }: TxtParagraphProps) => (
  <p className={className}>{children}</p>
)
