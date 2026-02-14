import { TollPage } from '@/pages/toll/toll'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_toll/toll/')({
  component: TollPage,
})
