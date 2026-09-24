import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { teamMembers } from '../../data/content.js'
import { images } from '../../data/images.js'
import styles from './Team.module.scss'

const NAME_MIN_PX = 28
const NAME_STEP_PX = 0.5
const MOBILE_QUERY = '(max-width: 599px)'
const TWEEN = {
  mobile: { scale: 0.7, pull: 0.3 },
  desktop: { scale: 0.82, pull: 0 },
}

// Embla silently disables loop when slides can't cover the viewport, so repeat the team
const LOOP_COPIES = 3
const slides = Array.from({ length: LOOP_COPIES }, (_, copy) =>
  teamMembers.map((member) => ({ member, key: `${copy}-${member.id}` })),
).flat()

function measureNameSize(el, preferredPx) {
  if (!el) return preferredPx

  let size = preferredPx
  el.style.fontSize = `${size}px`

  while (el.scrollWidth > el.clientWidth + 1 && size > NAME_MIN_PX) {
    size -= NAME_STEP_PX
    el.style.fontSize = `${size}px`
  }

  return size
}

export function Team() {
  const [selected, setSelected] = useState(teamMembers.length)
  const active = selected % teamMembers.length
  const nameRef = useRef(null)
  const nameSizesRef = useRef({})
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    skipSnaps: false,
    dragFree: false,
    duration: 18,
    startIndex: teamMembers.length,
  })

  const cacheNameSizes = useCallback(() => {
    const el = nameRef.current
    if (!el || el.clientWidth <= 0) return

    const probe = el.cloneNode(false)
    probe.className = el.className
    probe.setAttribute('aria-hidden', 'true')
    probe.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'pointer-events:none',
      `width:${el.clientWidth}px`,
      'left:-9999px',
      'top:0',
      'margin:0',
      'white-space:nowrap',
    ].join(';')

    el.parentNode?.appendChild(probe)

    const preferred = parseFloat(getComputedStyle(probe).fontSize) || 42
    const sizes = {}
    teamMembers.forEach((member) => {
      probe.textContent = member.name
      probe.style.fontSize = ''
      sizes[member.id] = measureNameSize(probe, preferred)
    })

    probe.remove()
    nameSizesRef.current = sizes
  }, [])

  const applyNameSize = useCallback((memberId) => {
    const el = nameRef.current
    if (!el) return

    const cached = nameSizesRef.current[memberId]
    if (cached) {
      el.style.fontSize = `${cached}px`
      return
    }

    el.style.fontSize = ''
    const preferred = parseFloat(getComputedStyle(el).fontSize) || 42
    const size = measureNameSize(el, preferred)
    nameSizesRef.current[memberId] = size
  }, [])

  useEffect(() => {
    teamMembers.forEach((member) => {
      const img = new Image()
      img.src = member.photo
      img.decode?.().catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return undefined

    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined

    let slideEls = []
    let photoEls = []
    const collectNodes = () => {
      slideEls = emblaApi.slideNodes()
      photoEls = slideEls.map((slide) => slide.querySelector(`.${styles.photoWrap}`))
    }

    const mobileMedia = window.matchMedia(MOBILE_QUERY)

    // Scale follows the live slide position, so it never snaps on select
    const tweenScale = () => {
      const { scale: minScale, pull } = mobileMedia.matches ? TWEEN.mobile : TWEEN.desktop
      const viewport = emblaApi.rootNode().getBoundingClientRect()
      const center = viewport.left + viewport.width / 2

      const offsets = slideEls.map((slide) => {
        const rect = slide.getBoundingClientRect()
        return { dx: (rect.left + rect.width / 2 - center) / rect.width, width: rect.width }
      })

      offsets.forEach(({ dx, width }, i) => {
        const distance = Math.min(Math.abs(dx), 1)
        const scale = 1 - distance * (1 - minScale)
        const shift = -Math.sign(dx) * distance * pull * width
        if (photoEls[i]) {
          photoEls[i].style.transform = `translate3d(${shift}px, 0, 0) scale(${scale})`
        }
      })
    }

    mobileMedia.addEventListener?.('change', tweenScale)

    collectNodes()
    tweenScale()
    // Embla positions slides after its own layout pass
    const frame = requestAnimationFrame(tweenScale)
    document.fonts?.ready.then(tweenScale)

    const onReInit = () => {
      collectNodes()
      tweenScale()
    }

    emblaApi.on('reInit', onReInit)
    emblaApi.on('resize', tweenScale)
    emblaApi.on('scroll', tweenScale)
    emblaApi.on('settle', tweenScale)

    return () => {
      cancelAnimationFrame(frame)
      mobileMedia.removeEventListener?.('change', tweenScale)
      emblaApi.off('reInit', onReInit)
      emblaApi.off('resize', tweenScale)
      emblaApi.off('scroll', tweenScale)
      emblaApi.off('settle', tweenScale)
    }
  }, [emblaApi])

  const activeRef = useRef(active)
  activeRef.current = active

  useLayoutEffect(() => {
    applyNameSize(teamMembers[active]?.id)
  }, [active, applyNameSize])

  useLayoutEffect(() => {
    const remeasure = () => {
      if (nameRef.current) nameRef.current.style.fontSize = ''
      nameSizesRef.current = {}
      cacheNameSizes()
      applyNameSize(teamMembers[activeRef.current]?.id)
    }

    remeasure()

    // iOS fires resize when the address bar hides/shows; only width matters here
    let lastWidth = window.innerWidth
    let frame = 0
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(remeasure)
    }

    window.addEventListener('resize', onResize)

    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) remeasure()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [applyNameSize, cacheNameSizes])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index) => {
      if (!emblaApi || index === emblaApi.selectedScrollSnap()) return
      emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  return (
    <section id="team" className={styles.team}>
      <div className={styles.inner}>
        <div className={styles.slider}>
          <div className={styles.frameSlot} aria-hidden>
            <div
              className={styles.frameLayer}
              style={{ '--team-frame': `url(${images.team.frame})` }}
            />
          </div>

          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.track}>
              {slides.map(({ member, key }, slideIndex) => (
                <div
                  key={key}
                  className={`${styles.slide}${selected === slideIndex ? ` ${styles.slideActive}` : ''}`}
                >
                  <button
                    type="button"
                    className={styles.slideHit}
                    aria-label={member.name}
                    aria-current={selected === slideIndex ? 'true' : undefined}
                    aria-hidden={Math.floor(slideIndex / teamMembers.length) === 1 ? undefined : true}
                    tabIndex={Math.floor(slideIndex / teamMembers.length) === 1 ? undefined : -1}
                    onClick={() => scrollTo(slideIndex)}
                  >
                    <div className={styles.photoWrap}>
                      <img
                        className={styles.photo}
                        src={member.photo}
                        alt={member.name}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden'
                        }}
                      />
                      <div className={styles.photoSilk} aria-hidden />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.silk} aria-hidden />

          <div className={styles.info}>
            <div className={styles.nameRow}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navBtnPrev}`}
                aria-label="Предыдущий"
                onClick={scrollPrev}
              >
                <svg viewBox="0 0 24 48" aria-hidden focusable="false">
                  <path
                    d="M16 4 L6 24 L16 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h2 key={active} ref={nameRef} className={`${styles.name} ${styles.swap}`}>
                {teamMembers[active].name}
              </h2>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navBtnNext}`}
                aria-label="Следующий"
                onClick={scrollNext}
              >
                <svg viewBox="0 0 24 48" aria-hidden focusable="false">
                  <path
                    d="M8 4 L18 24 L8 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p key={`role-${active}`} className={`${styles.role} ${styles.swap}`}>
              {teamMembers[active].role}
            </p>
            {teamMembers[active].note ? (
              <p key={`note-${active}`} className={`${styles.note} ${styles.swap}`}>
                {teamMembers[active].note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
