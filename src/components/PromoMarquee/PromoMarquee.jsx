import { promoText } from '../../data/content.js'
import styles from './PromoMarquee.module.scss'

export function PromoMarquee() {
  const repeat = Array.from({ length: 10 }, (_, i) => (
    <span key={i} className={styles.item}>
      {promoText}
    </span>
  ))

  return (
    <div className={styles.wrap} aria-hidden>
      <div className={styles.track}>{repeat}</div>
      <div className={styles.track}>{repeat}</div>
    </div>
  )
}
