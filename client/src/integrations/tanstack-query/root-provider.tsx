import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient/queryClient'

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: import('@tanstack/react-query').QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
