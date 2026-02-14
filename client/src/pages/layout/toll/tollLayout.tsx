import { Outlet } from "@tanstack/react-router"

export const TollLayout = () => {
  return (
    <div className="min-h-screen bg-toll-page text-[#333]">
      <Outlet />
    </div>
  )
}