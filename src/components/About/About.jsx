import { images } from '../../data/images.js'
import styles from './About.module.scss'

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <img className={styles.bg} src={images.about} alt="" aria-hidden decoding="async" />
      <div className={styles.inner}>
        <p className={styles.intro}>
          <span className={styles.introLine}>слушаем, спорим, предлагаем и делаем.</span>{' '}
          <span className={styles.introLine}>не обещаем «как на картинке» — обещаем,</span>{' '}
          <span className={styles.introLine}>что ты выйдешь с ощущением: «да, это&nbsp;моё!»</span>
        </p>

        <h2 id="about-title" className={styles.headline}>
          не просто бьюти мастера{' '}
          <strong>
            твои союзники{' '}
            <span className={styles.headlineRest}>
              в поисках лучшей <br className={styles.mBr} />
              версии себя
            </span>
          </strong>
        </h2>

        <p className={styles.watermark} aria-hidden>
          <span className={styles.wmLine}>кто</span>
          <span className={styles.wmLine}>мы?</span>
        </p>
      </div>
    </section>
  )
}
