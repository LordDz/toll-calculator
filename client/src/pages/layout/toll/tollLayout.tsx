import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => {
  return (
    <div className="text-text-primary">
      <ReactQueryDevtools buttonPosition="top-right" />
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Outlet />
        </div>
    </div>
  )
}