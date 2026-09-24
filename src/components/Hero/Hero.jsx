import { bookingUrl } from '../../data/content.js'
import { images } from '../../data/images.js'
import { PromoMarquee } from '../PromoMarquee/PromoMarquee.jsx'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-label="Главный экран">
      <img
        className={styles.bg}
        src={images.hero}
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.overlay} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.title}>тот самый салон</h1>
          <p className={styles.subtitle}>о котором говорят все</p>
          <a
            href={bookingUrl}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            записаться онлайн
          </a>
        </div>
      </div>
      <PromoMarquee />
    </section>
  )
}
