import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { bookingUrl, navItems } from '../../data/content.js'
import { images } from '../../data/images.js'
import { iosSpring } from '../../lib/motion.js'
import { scrollToSection, scrollToTop } from '../../utils/scroll.js'
import { MenuToggle } from './MenuToggle.jsx'
import { MobileMenuLink } from './MobileMenuLink.jsx'
import styles from './Header.module.scss'

const COMPACT_SCROLL_THRESHOLD = 32

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

function getHeaderMode() {
  return window.scrollY > COMPACT_SCROLL_THRESHOLD ? 'compact' : 'hero'
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerShown, setDrawerShown] = useState(false)
  const [headerMode, setHeaderMode] = useState('hero')
  const [portalReady, setPortalReady] = useState(false)
  const { pathname } = useLocation()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  const handleLogoClick = (e) => {
    closeMenu()
    if (pathname === '/') {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleNavClick = (path, sectionId) => (e) => {
    closeMenu()
    if (pathname === path) {
      e.preventDefault()
      scrollToSection(sectionId)
    }
  }

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    const update = () => setHeaderMode(getHeaderMode())

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('scrollend', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('scrollend', update)
    }
  }, [pathname])

  useEffect(() => {
    document.documentElement.dataset.header = headerMode === 'compact' ? 'compact' : 'full'
    return () => {
      delete document.documentElement.dataset.header
    }
  }, [headerMode])

  useEffect(() => {
    if (menuOpen) setDrawerShown(true)
  }, [menuOpen])

  const drawerActive = menuOpen || drawerShown

  useEffect(() => {
    document.body.classList.toggle('menu-open', drawerActive)
    return () => document.body.classList.remove('menu-open')
  }, [drawerActive])

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

  const themeClass = headerMode === 'hero' ? styles.heroTheme : styles.compactTheme

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
        className={`${styles.shell} ${themeClass} ${drawerActive ? styles.shellOpen : ''}`}
      >
        <div className={styles.bar}>
          <Link
            to="/"
            className={styles.logo}
            aria-label="MVZ Friends — на главную"
            onClick={handleLogoClick}
          >
            <span className={styles.logoMain}>MVZ</span>
            <span className={styles.logoSub}>FRIends</span>
          </Link>

          <nav className={styles.navDesktop} aria-label="Основная навигация">
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

          <div className={styles.mobileBar}>
            <MenuToggle open={menuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </header>
      {drawer}
    </>
  )
}
