import { useEffect, useRef, useState } from 'react'
import { scrollTo } from '../../hooks/useLenis.js'
import styles from './ScrollBar.module.scss'

const MIN_THUMB = 48
const INSET = 4

const finePointerQuery = '(hover: hover) and (pointer: fine)'

/** Overlay scrollbar: the native one is hidden on mouse devices so it never eats page width. */
export function ScrollBar() {
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(finePointerQuery).matches,
  )
  const thumbRef = useRef(null)
  const metricsRef = useRef({ thumb: 0, travel: 0, max: 0 })

  useEffect(() => {
    const mq = window.matchMedia(finePointerQuery)
    const onChange = () => setEnabled(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const thumb = thumbRef.current
    if (!thumb) return undefined
    let raf = 0

    const render = () => {
      raf = 0
      const root = document.documentElement
      const view = window.innerHeight
      const max = Math.max(0, root.scrollHeight - view)
      const track = view - INSET * 2
      const size = max > 0 ? Math.max(MIN_THUMB, (view / root.scrollHeight) * track) : 0
      const travel = track - size
      metricsRef.current = { thumb: size, travel, max }
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      thumb.style.height = `${size}px`
      thumb.style.transform = `translate3d(0, ${INSET + progress * travel}px, 0)`
      thumb.style.opacity = max > 0 ? '' : '0'
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [enabled])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const thumb = thumbRef.current
    thumb.setPointerCapture(e.pointerId)
    thumb.dataset.dragging = ''
    const startY = e.clientY
    const startScroll = window.scrollY

    const onMove = (ev) => {
      const { travel, max } = metricsRef.current
      if (travel <= 0) return
      const y = startScroll + ((ev.clientY - startY) / travel) * max
      scrollTo(Math.min(max, Math.max(0, y)), { immediate: true })
    }
    const onUp = () => {
      delete thumb.dataset.dragging
      thumb.removeEventListener('pointermove', onMove)
      thumb.removeEventListener('pointerup', onUp)
      thumb.removeEventListener('pointercancel', onUp)
    }

    thumb.addEventListener('pointermove', onMove)
    thumb.addEventListener('pointerup', onUp)
    thumb.addEventListener('pointercancel', onUp)
  }

  if (!enabled) return null

  return (
    <div className={styles.rail} aria-hidden>
      <div ref={thumbRef} className={styles.thumb} onPointerDown={onPointerDown} />
    </div>
  )
}
