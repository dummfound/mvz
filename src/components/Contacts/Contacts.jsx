import { bookingUrl } from '../../data/content.js'
import { images } from '../../data/images.js'
import styles from './Contacts.module.scss'

export function Contacts() {
  return (
    <section id="contacts" className={styles.contacts} aria-labelledby="contacts-title">
      <img className={styles.bg} src={images.about} alt="" aria-hidden decoding="async" />
      <div className={styles.inner}>
        <div className={styles.top}>
          <h2 id="contacts-title" className={styles.title}>
            контакты
          </h2>
          <p className={styles.intro}>
            приходи знакомиться. запишись онлайн или напиши нам — подберём время и мастера
          </p>
        </div>

        <div className={styles.main}>
          <a
            href={bookingUrl}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            записаться онлайн
          </a>

          <dl className={styles.list}>
            <div className={styles.row}>
              <dt className={styles.label}>адрес</dt>
              <dd className={styles.value}>— уточнить</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>телефон</dt>
              <dd className={styles.value}>
                <a href="tel:+70000000000">+7 (000) 000-00-00</a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>соцсети</dt>
              <dd className={`${styles.value} ${styles.social}`}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  instagram
                </a>
                <a href="https://t.me" target="_blank" rel="noreferrer">
                  telegram
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <p className={styles.copy}>© MVZ FRIends 2026</p>
      </div>
    </section>
  )
}
