import { TollLayout } from '@/pages/layout/toll/tollLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_toll')({
  component: TollLayout,
})

