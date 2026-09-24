import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { iosSpring, textSwapSpring } from '../../lib/motion.js'
import styles from './MenuToggle.module.scss'

export function MenuToggle({ open, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      className={`${styles.toggle}${open ? ` ${styles.close}` : ''}`}
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-drawer"
      aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="close"
            className={`${styles.icon} ${styles.iconClose}`}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: hovered ? 1.06 : 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={iosSpring}
          >
            <span className={styles.cross}>
              <span />
              <span />
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            className={styles.row}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className={styles.icon}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={iosSpring}
            >
              <span className={styles.dots}>
                <i />
                <i />
                <i />
                <i />
              </span>
            </motion.span>
            <span className={styles.label}>
              <span className={styles.slot}>
                <motion.span
                  className={styles.track}
                  animate={{ y: hovered ? '-50%' : '0%' }}
                  transition={textSwapSpring}
                >
                  <span className={styles.line}>Меню</span>
                  <span className={styles.line} aria-hidden="true">
                    Меню
                  </span>
                </motion.span>
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
