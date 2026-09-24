export function scrollToTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}

export function scrollToSection(sectionId, smooth = true) {
  const el = document.getElementById(sectionId)
  if (!el) return

  const header = document.querySelector('header')
  const headerOffset = header?.offsetHeight ?? 72
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset

  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
}
