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

    if (pathname === '/') {
      scrollToTop(smooth)
      return
    }

    const sectionId = pathToSection[pathname]
    if (!sectionId) return

    // Let compact header CSS apply before measuring offset
    document.documentElement.dataset.header = 'compact'
    const id = window.requestAnimationFrame(() => {
      scrollToSection(sectionId, smooth)
    })
    return () => window.cancelAnimationFrame(id)
  }, [pathname])
}
