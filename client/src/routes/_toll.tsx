import { TollLayout } from '@/pages/layout/toll/toll'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_toll')({
  component: TollLayout,
})

