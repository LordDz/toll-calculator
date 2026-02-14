import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => (
  <>
    <ReactQueryDevtools buttonPosition="top-right" />
    <div className="animate-fade-in">

    <Outlet />
    </div>
  </>)