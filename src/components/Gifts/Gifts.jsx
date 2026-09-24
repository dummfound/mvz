import { images } from '../../data/images.js'
import styles from './Gifts.module.scss'

function CardStack({ cards, variant }) {
  return (
    <div className={`${styles.cardStack} ${styles[variant]}`}>
      {cards.map((src) => (
        <img key={src} className={styles.cardLayer} src={src} alt="" loading="lazy" />
      ))}
    </div>
  )
}

export function Gifts() {
  return (
    <section id="gifts" className={styles.gifts}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <article className={styles.col}>
            <CardStack cards={images.gifts.certificates} variant="certificates" />
            <h2 className={styles.title}>подарочные сертификаты</h2>
            <p className={styles.text}>
              не знаешь что подарить?
              <br />
              <strong>подари уверенность</strong>
            </p>
          </article>

          <article className={styles.col}>
            <CardStack cards={images.gifts.subscription} variant="subscription" />
            <h2 className={styles.title}>абонементы</h2>
            <p className={styles.text}>
              цветы завянут
              <br />
              а с новой укладкой — она тебя точно запомнит
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
