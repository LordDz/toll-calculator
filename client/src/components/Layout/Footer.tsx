import toast from 'react-hot-toast'

export function Footer() {
  const handleMouseEnter = () => {
    toast(    <a
      href="https://www.linkedin.com/in/david-zetterdahl/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:no-underline"
    >
      Linkedin: David Zetterdahl
    </a>, {
      position: 'bottom-center',
      duration: 2000,
      icon: '😁',
    })
  }

  return (
    <footer className="bg-muted text-muted-foreground  py-4 flex flex-row justify-center items-center gap-1">
      Made by
      <a href="https://www.linkedin.com/in/david-zetterdahl/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:no-underline"
        onMouseEnter={handleMouseEnter}
      >
        🎈 David Zetterdahl
      </a>
    </footer>
  )
}
