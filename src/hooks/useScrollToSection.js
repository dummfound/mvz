import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { navItems } from '../data/content.js'
import { scrollToSection, scrollToTop } from '../utils/scroll.js'

const pathToSection = Object.fromEntries(
  navItems.map((item) => [item.path, item.sectionId]),
)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useScrollToSection() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const smooth = !prefersReducedMotion()

    // Home: only snap to top when arriving from another route, not on remount
    if (pathname === '/') {
      if (window.scrollY > 2) scrollToTop(smooth)
      return
    }

    const sectionId = pathToSection[pathname]
    if (!sectionId) return

    document.documentElement.dataset.header = 'compact'

    // Native iOS scroll needs a tick after route + unlockBodyScroll
    const id = window.setTimeout(() => {
      scrollToSection(sectionId, smooth)
    }, 50)

    return () => window.clearTimeout(id)
  }, [pathname])
}
