type SectionTitleProps = {
  children: React.ReactNode
}

export const SectionTitle = ({ children }: SectionTitleProps) => (
  <h2 className="text-xl font-semibold text-white mb-4">{children}</h2>
)
