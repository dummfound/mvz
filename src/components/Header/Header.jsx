import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { bookingUrl, navItems } from '../../data/content.js'
import { images } from '../../data/images.js'
import { lockBodyScroll } from '../../hooks/lockBodyScroll.js'
import { getLenis } from '../../hooks/useLenis.js'
import { iosSpring } from '../../lib/motion.js'
import { scrollToSection, scrollToTop } from '../../utils/scroll.js'
import { MenuToggle } from './MenuToggle.jsx'
import { MobileMenuLink } from './MobileMenuLink.jsx'
import styles from './Header.module.scss'

gsap.registerPlugin(Flip)

// Separate enter / exit points so the header doesn't flicker around one threshold
const COMPACT_ENTER_Y = 48
const COMPACT_EXIT_Y = 16
const MORPH_DURATION = 0.6
const MORPH_EASE = 'power3.inOut'
const MENU_CLOSE_MS = 380

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
  },
}

const panelVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { ...iosSpring, duration: 0.55 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
  },
}

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
}

const linkVariants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: iosSpring,
  },
}

function getHeaderMode(current) {
  const lenis = getLenis()
  const y = lenis?.scroll ?? window.scrollY
  // Compact only by scroll — section routes (/services etc.) can return to hero at top
  if (y > COMPACT_ENTER_Y) return 'compact'
  if (y < COMPACT_EXIT_Y) return 'hero'
  return current
}

// GSAP can't tween from `none`, so give it a transparent shadow of the same shape
function readShadow(style) {
  return style.boxShadow === 'none' ? 'rgba(10, 10, 10, 0) 0px 1px 0px 0px' : style.boxShadow
}

function isRendered(el) {
  return Boolean(el) && el.getClientRects().length > 0
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerShown, setDrawerShown] = useState(false)
  const [headerMode, setHeaderMode] = useState('hero')
  const [portalReady, setPortalReady] = useState(false)
  const shellRef = useRef(null)
  const logoRef = useRef(null)
  const logoMainRef = useRef(null)
  const logoSubRef = useRef(null)
  const navRef = useRef(null)
  const mobileBarRef = useRef(null)
  const modeTweenRef = useRef(null)
  const modeRef = useRef('hero')
  const menuOpenRef = useRef(false)
  const morphFromRef = useRef(null)
  const { pathname } = useLocation()

  const getMorphTargets = useCallback(() => {
    const links = navRef.current ? [...navRef.current.querySelectorAll('a')] : []
    return [logoMainRef.current, logoSubRef.current, ...links].filter(isRendered)
  }, [])

  // The round menu toggle must never be scaled by Flip, so it only slides and recolors
  const readToggle = useCallback(() => {
    const bar = mobileBarRef.current
    if (!isRendered(bar)) return null
    const box = (bar.firstElementChild ?? bar).getBoundingClientRect()
    return { center: box.top + box.height / 2, color: getComputedStyle(bar).color }
  }, [])

  // Snapshot the current look right before React swaps the theme class
  const applyMode = useCallback(
    (next) => {
      if (next === modeRef.current) return
      const shell = shellRef.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (shell && !reduced && !menuOpenRef.current) {
        modeTweenRef.current?.kill()
        const targets = getMorphTargets()
        const state = Flip.getState(targets, { props: 'color' })
        const style = getComputedStyle(shell)
        morphFromRef.current = {
          state,
          height: shell.getBoundingClientRect().height,
          backgroundColor: style.backgroundColor,
          boxShadow: readShadow(style),
          toggle: readToggle(),
        }
        gsap.set([shell, ...targets, mobileBarRef.current].filter(Boolean), {
          clearProps: 'transform,color,height,backgroundColor,boxShadow',
        })
      }

      modeRef.current = next
      setHeaderMode(next)
    },
    [getMorphTargets, readToggle],
  )
  const navigate = useNavigate()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  const handleLogoClick = (e) => {
    if (menuOpen) {
      e.preventDefault()
      closeMenu()
      window.setTimeout(() => {
        if (pathname === '/') scrollToTop()
        else navigate('/')
      }, MENU_CLOSE_MS)
      return
    }
    if (pathname === '/') {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleNavClick = (path, sectionId) => (e) => {
    if (!menuOpen) {
      if (pathname === path) {
        e.preventDefault()
        scrollToSection(sectionId)
      }
      return
    }

    // Wait until lockBodyScroll unlocks, otherwise Lenis restores the old Y
    e.preventDefault()
    closeMenu()
    window.setTimeout(() => {
      if (pathname === path) scrollToSection(sectionId)
      else navigate(path)
    }, MENU_CLOSE_MS)
  }

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    const update = () => applyMode(getHeaderMode(modeRef.current))

    // Section routes scroll to a block below the fold — start compact to avoid hero flash
    if (pathname !== '/') applyMode('compact')
    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('scrollend', update)

    let lenis = getLenis()
    const attachLenis = () => {
      lenis = getLenis()
      lenis?.on('scroll', update)
    }
    // useLenis mounts on the parent; attach after it initializes
    const raf = requestAnimationFrame(attachLenis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('scrollend', update)
      lenis?.off('scroll', update)
      getLenis()?.off('scroll', update)
    }
  }, [pathname, applyMode])

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  useEffect(() => () => {
    delete document.documentElement.dataset.header
  }, [])

  // Hero ↔ compact morph: the theme class sets the end layout, Flip tweens every
  // element from its snapshot, and the bar height / background follow on the same curve
  useLayoutEffect(() => {
    document.documentElement.dataset.header = headerMode === 'compact' ? 'compact' : 'full'

    const shell = shellRef.current
    const from = morphFromRef.current
    morphFromRef.current = null
    if (!shell || !from) return

    const to = getComputedStyle(shell)
    const toHeight = shell.getBoundingClientRect().height
    const toBackground = to.backgroundColor
    const toShadow = readShadow(to)
    const tl = gsap.timeline({ defaults: { duration: MORPH_DURATION, ease: MORPH_EASE } })
    modeTweenRef.current = tl

    tl.add(
      Flip.from(from.state, {
        duration: MORPH_DURATION,
        ease: MORPH_EASE,
        scale: true,
        clearProps: 'transform,color',
      }),
      0,
    )
    tl.fromTo(
      shell,
      { height: from.height, backgroundColor: from.backgroundColor, boxShadow: from.boxShadow },
      {
        height: toHeight,
        backgroundColor: toBackground,
        boxShadow: toShadow,
        clearProps: 'height,backgroundColor,boxShadow',
      },
      0,
    )

    const toToggle = readToggle()
    if (from.toggle && toToggle) {
      tl.fromTo(
        mobileBarRef.current,
        { y: from.toggle.center - toToggle.center, color: from.toggle.color },
        { y: 0, color: toToggle.color, clearProps: 'transform,color' },
        0,
      )
    }
  }, [headerMode, readToggle])

  useEffect(() => {
    if (!menuOpen) return
    const tl = modeTweenRef.current
    if (tl) {
      tl.progress(1)
      tl.kill()
    }
  }, [menuOpen])

  useEffect(() => () => modeTweenRef.current?.kill(), [])

  // Entrance: soft settle on first paint
  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const logo = logoRef.current
    const nav = navRef.current
    const mobileBar = mobileBarRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        shell,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.05 },
      )
      if (logo) {
        gsap.fromTo(
          logo,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.12 },
        )
      }
      if (nav) {
        gsap.fromTo(
          nav,
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.2 },
        )
      }
      if (mobileBar) {
        gsap.fromTo(
          mobileBar,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: 'power2.out', delay: 0.18 },
        )
      }
    }, shell)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (menuOpen) setDrawerShown(true)
  }, [menuOpen])

  const drawerActive = menuOpen || drawerShown

  useEffect(() => {
    if (!menuOpen) return undefined
    return lockBodyScroll()
  }, [menuOpen])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeMenu])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) closeMenu()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [closeMenu])

  const themeClass =
    headerMode === 'hero' ? styles.heroTheme : styles.compactTheme

  const drawer =
    portalReady
      ? createPortal(
          <AnimatePresence onExitComplete={() => setDrawerShown(false)}>
            {menuOpen && (
              <motion.div
                id="site-drawer"
                className={styles.mobileMenu}
                role="dialog"
                aria-modal="true"
                aria-label="Меню"
                data-lenis-prevent=""
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className={styles.panel}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <img
                    className={styles.panelTexture}
                    src={images.menu.texture}
                    alt=""
                    aria-hidden
                    decoding="async"
                  />
                  <div className={styles.top}>
                    <p className={styles.brand}>
                      тот самый салон · о котором говорят все
                    </p>
                  </div>

                  <motion.nav
                    className={styles.menuNav}
                    aria-label="Мобильная навигация"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ul className={styles.menuList}>
                      {navItems.map((item) => (
                        <motion.li key={item.path} variants={linkVariants}>
                          <MobileMenuLink
                            to={item.path}
                            label={item.label}
                            onClick={handleNavClick(item.path, item.sectionId)}
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </motion.nav>

                  <motion.div
                    className={styles.facesSlot}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...iosSpring, delay: 0.22 }}
                  >
                    <img
                      className={styles.faces}
                      src={images.menu.faces}
                      alt=""
                      aria-hidden
                      decoding="async"
                    />
                  </motion.div>

                  <motion.div
                    className={styles.menuFooter}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...iosSpring, delay: 0.35 }}
                  >
                    <a
                      href={bookingUrl}
                      className={styles.book}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                    >
                      Записаться
                    </a>
                    <p className={styles.note}>Онлайн-запись 24/7</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <>
      <header
        ref={shellRef}
        className={`${styles.shell} ${themeClass} ${drawerActive ? styles.shellOpen : ''}`}
      >
        <div className={styles.bar}>
          <Link
            ref={logoRef}
            to="/"
            className={styles.logo}
            aria-label="MVZ Friends — на главную"
            onClick={handleLogoClick}
          >
            <span ref={logoMainRef} className={styles.logoMain}>
              MVZ
            </span>
            <span ref={logoSubRef} className={styles.logoSub}>
              FRIends
            </span>
          </Link>

          <nav ref={navRef} className={styles.navDesktop} aria-label="Основная навигация">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? styles.active : undefined)}
                    onClick={handleNavClick(item.path, item.sectionId)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div ref={mobileBarRef} className={styles.mobileBar}>
            <MenuToggle open={menuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </header>
      {drawer}
    </>
  )
}
