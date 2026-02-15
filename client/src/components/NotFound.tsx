import { TxtPageTitle } from '@/components/text/MenuHeader'
import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <div className="animate-fade-in text-center py-12">
    <TxtPageTitle>Page not found</TxtPageTitle>
    <p className="mt-4 text-text-secondary">
      The droids you're looking for have been moved to another galaxy.
    </p>
    <p className="mt-6">
      <Link
        to="/"
        className="text-button font-medium underline underline-offset-4 hover:no-underline"
      >
        ← Back to home
      </Link>
    </p>
  </div>
)
