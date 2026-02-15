import { createRootRouteWithContext } from '@tanstack/react-router'

import { RootLayout } from '@/pages/layout/root/rootLayout'
import type { QueryClient } from '@tanstack/react-query'
import { NotFound } from '@/components/NotFound'
import { RootDocument } from '../components/RootDocument'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Toll Calculator Dz',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})
