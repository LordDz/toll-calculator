import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => {
  return (
    <div className="min-h-screen bg-toll-page text-text-primary">
      <ReactQueryDevtools buttonPosition="top-right" />
      <Outlet />
    </div>
  )
}