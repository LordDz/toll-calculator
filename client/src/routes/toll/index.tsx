import { createFileRoute } from '@tanstack/react-router'
import { TollPage } from '@/pages/toll'

export const Route = createFileRoute('/toll/')({
  component: TollPage,
})
