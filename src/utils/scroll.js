import { getLenis, scrollTo } from '../hooks/useLenis.js'

function readCssPx(cssValue) {
  const probe = document.createElement('div')
  probe.style.cssText = `position:absolute;left:0;top:0;height:${cssValue};visibility:hidden;pointer-events:none`
  document.documentElement.appendChild(probe)
  const px = probe.getBoundingClientRect().height || 0
  probe.remove()
  return px
}

/** Compact chrome height — section landings shrink the header. */
export function readCompactHeaderOffset() {
  const root = document.documentElement
  root.dataset.header = 'compact'
  void root.offsetHeight
  const px = readCssPx('var(--header-height)')
  // Ceil + 1px closes Lenis/GPU subpixel hairlines under fixed chrome
  return Math.max(1, Math.ceil(px) + 1)
}

function readScrollY() {
  return getLenis()?.scroll ?? window.scrollY ?? document.documentElement.scrollTop ?? 0
}

function sectionScrollTop(el, headerOffset) {
  return Math.max(
    0,
    el.getBoundingClientRect().top + readScrollY() - headerOffset,
  )
}

export function scrollToTop(smooth = true) {
  scrollTo(0, { immediate: !smooth })
}

export function scrollToSection(sectionId, smooth = true) {
  const el = document.getElementById(sectionId)
  if (!el) return

  // Land under compact bar (header shrinks once we leave the top)
  const headerOffset = readCompactHeaderOffset()
  const top = sectionScrollTop(el, headerOffset)
  const hasLenis = Boolean(getLenis())

  const go = () => {
    scrollTo(top, {
      immediate: !smooth,
      ...(hasLenis && smooth ? { duration: 1.15 } : {}),
      onComplete: () => {
        const delta = el.getBoundingClientRect().top - headerOffset
        if (Math.abs(delta) > 1) {
          scrollTo(readScrollY() + delta, { immediate: true })
        }
      },
    })
  }

  // iOS often drops smooth scrollTo from useLayoutEffect — defer one frame
  if (!hasLenis) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(go)
    })
    return
  }

  go()
}
