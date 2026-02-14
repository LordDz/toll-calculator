type TxtPageTitleProps = {
  children: React.ReactNode
}

export const TxtPageTitle = ({ children }: TxtPageTitleProps) => (
  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
    {children}
  </h1>
)
