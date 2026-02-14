import { TxtPageTitle } from "@/components/text/MenuHeader"
import { Link } from "@tanstack/react-router"

export const HomePage = () => {
  return (
    <div className="animate-fade-in">
      <TxtPageTitle>Welcome to the Home Page</TxtPageTitle>
      <p className="mt-4 text-muted-foreground">
        Hey Ivy devs — welcome to the toll calculator project. Feel free to poke around and reach out if you have questions.
      </p>
    
      <p className="mt-4">
        <Link to="/toll" className="text-primary underline underline-offset-4 hover:no-underline">
          Open the calculator →
        </Link>
      </p>
    </div>
  )
}