import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

/** @type {Lenis | null} */
let lenisInstance = null
let lockCount = 0

/** iPhone / touch phones: Lenis kills native inertia — keep native scroll there. */
const shouldUseLenis = () => {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }
  // Mobile / tablet layout — always native (matches site $bp-desktop)
  if (!window.matchMedia('(min-width: 1024px)').matches) return false
  // Real iPhone / iPod even if somehow desktop-width
  if (/iPhone|iPod/i.test(navigator.userAgent || '')) return false
  // Coarse pointer / no hover
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    return false
  }
  // Fine pointer + hover ≈ desktop mouse/trackpad
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export const getLenis = () => lenisInstance

/**
 * Programmatic scroll via Lenis when available, otherwise native window.
 * @param {number | HTMLElement | string} target
 * @param {{ immediate?: boolean; offset?: number; duration?: number; onComplete?: () => void }} [options]
 */
export const scrollTo = (target, options = {}) => {
  const { immediate = false, offset = 0, duration, onComplete } = options
  const lenis = lenisInstance

  if (lenis) {
    lenis.scrollTo(target, {
      immediate,
      offset,
      ...(duration != null ? { duration } : {}),
      force: true,
      programmatic: true,
      ...(onComplete ? { onComplete } : {}),
    })
    return
  }

  let top = 0
  if (typeof target === 'number') {
    top = target
  } else if (typeof target === 'string') {
    const el = document.querySelector(target)
    if (!el) return
    top = el.getBoundingClientRect().top + window.scrollY + offset
  } else if (target instanceof HTMLElement) {
    top = target.getBoundingClientRect().top + window.scrollY + offset
  }

  const y = Math.max(0, top)
  // iOS Safari: set scrollTop as well — window.scrollTo smooth is flaky after unlock
  if (immediate) {
    window.scrollTo(0, y)
    document.documentElement.scrollTop = y
    document.body.scrollTop = y
    onComplete?.()
    return
  }

  window.scrollTo({ top: y, behavior: 'smooth' })
  // Fallback if smooth is ignored (older iOS / mid-unlock)
  window.setTimeout(() => {
    if (Math.abs((window.scrollY || document.documentElement.scrollTop) - y) > 8) {
      window.scrollTo(0, y)
      document.documentElement.scrollTop = y
      document.body.scrollTop = y
    }
    onComplete?.()
  }, 450)
}

/** Pause Lenis while overlays lock the page (menu / radio). Nested-safe. */
export const pauseLenis = () => {
  lockCount += 1
  lenisInstance?.stop()
}

export const resumeLenis = () => {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) lenisInstance?.start()
}

/**
 * Document-level Lenis driven by GSAP ticker (desktop only).
 * iOS / touch keeps native inertia; ScrollTrigger still works on window scroll.
 */
export const useLenis = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (!shouldUseLenis()) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return undefined
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      anchors: false,
      respectReducedMotion: true,
      // Nested overflow:auto panels keep native scroll
      prevent: (node) => node?.closest?.('[data-lenis-prevent]') != null,
    })

    lenisInstance = lenis
    lockCount = 0

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(tick)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
      lockCount = 0
      ScrollTrigger.refresh()
    }
  }, [])
}
