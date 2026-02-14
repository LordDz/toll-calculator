import {
  Menu
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MenuContent } from './Header/Menu/Content'
import { Logo } from './Navigate/Logo'

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
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={handleOpenMenu}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className='ml-10'>

          <Logo />
        </div>
      </header>
      <MenuContent isOpen={isOpen} onClose={handleCloseMenu} />
    </>
  )
}
