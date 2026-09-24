import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { navItems } from '../data/content.js'
import { scrollToSection, scrollToTop } from '../utils/scroll.js'

const pathToSection = Object.fromEntries(
  navItems.map((item) => [item.path, item.sectionId]),
)

export function useScrollToSection() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/') {
      scrollToTop()
      return
    }

    const sectionId = pathToSection[pathname]
    if (sectionId) scrollToSection(sectionId)
  }, [pathname])
}
