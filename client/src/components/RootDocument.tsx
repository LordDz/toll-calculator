import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'

import { Toaster } from 'react-hot-toast'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Header } from './Header'

export function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="min-h-screen bg-toll-page">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <Toaster position="bottom-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
