import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { textSwapSpring } from '../../lib/motion.js'
import styles from './MobileMenuLink.module.scss'

export function MobileMenuLink({ to, label, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.link}${isActive ? ` ${styles.linkActive}` : ''}`
      }
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <span className={styles.slot}>
        <motion.span
          className={styles.track}
          animate={{ y: hovered ? '-50%' : '0%' }}
          transition={textSwapSpring}
        >
          <span className={styles.line}>{label}</span>
          <span className={styles.line} aria-hidden="true">
            {label}
          </span>
        </motion.span>
      </span>
    </NavLink>
  )
}
