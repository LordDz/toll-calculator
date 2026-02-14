type TxtPageTitleProps = {
  children: React.ReactNode
}

export const TxtPageTitle = ({ children }: TxtPageTitleProps) => (
  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#5A7B61] to-[#7A9B7E] bg-clip-text text-transparent">
    {children}
  </h1>
)
