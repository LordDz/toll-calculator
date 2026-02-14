import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '../Navigate/Logo'
import { MenuContent } from './Menu/Content'

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleOpenMenu = () => {
    setIsOpen(true)
  }
  const handleCloseMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header className="p-4 grid grid-cols-[auto, 1fr] items-center bg-gray-200 text-white shadow-lg">
        <button
          onClick={handleOpenMenu}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Logo />
      
      </header>

      <MenuContent isOpen={isOpen} onClose={handleCloseMenu} />
    </>
  )
}
