import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => (
  <>
    <ReactQueryDevtools buttonPosition="bottom-right" />
    <div className="animate-fade-in">

    <Outlet />
    </div>
  </>)