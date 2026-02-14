import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Outlet />
    </div>
  )
}