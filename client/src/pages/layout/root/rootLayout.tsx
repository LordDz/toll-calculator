import { Outlet } from "@tanstack/react-router"

export const RootLayout = () => (
      <div className="max-w-4xl mx-auto px-4 pt-8 text-text-primary animate-fade-in">
        <Outlet />
      </div>)
