import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'

import { Toaster } from 'react-hot-toast'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Header } from './Header'
import { Footer } from './Layout'

export function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="min-h-screen bg-toll-page">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">
          <Header />
          {children}
        </div>
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
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
