import { images } from '../../data/images.js'
import styles from './About.module.scss'

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <img className={styles.bg} src={images.about} alt="" aria-hidden decoding="async" />
      <div className={styles.inner}>
        <p className={styles.intro}>
          слушаем, спорим, предлагаем и делаем. не обещаем «как на картинке» — обещаем,
          что ты выйдешь с ощущением: «да, это моё!»
        </p>

        <h2 id="about-title" className={styles.headline}>
          не просто бьюти мастера{' '}
          <strong>твои союзники в поисках лучшей версии себя</strong>
        </h2>

        <p className={styles.watermark} aria-hidden>
          кто мы?
        </p>
      </div>
    </section>
  )
}
