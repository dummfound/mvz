import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { bookingUrl, contactsInfo } from '../../data/content.js'
import { scrollToTop } from '../../utils/scroll.js'
import styles from './Contacts.module.scss'

export function Contacts() {
  return (
    <section id="contacts" className={styles.contacts} aria-labelledby="contacts-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="contacts-title" className={styles.eyebrow}>
            контакты
          </h2>
          <p className={styles.title} aria-hidden>
            <span>приходи</span>
            <span>знакомиться</span>
          </p>
          <div className={styles.aside}>
            <p className={styles.intro}>
              запишись онлайн или напиши нам — подберём время и&nbsp;мастера
            </p>
            <a
              href={bookingUrl}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.btnText}>записаться онлайн</span>
              <ArrowUpRight className={styles.arrow} strokeWidth={2.25} aria-hidden />
            </a>
          </div>
        </div>

        <dl className={styles.list}>
          <div className={`${styles.row} ${styles.rowWide}`}>
            <dt className={styles.label}>адрес</dt>
            <dd className={styles.value}>
              <a href={contactsInfo.addressUrl} target="_blank" rel="noopener noreferrer">
                {contactsInfo.address}
              </a>
            </dd>
          </div>
          <div className={`${styles.row} ${styles.rowWide}`}>
            <dt className={styles.label}>телефон</dt>
            <dd className={styles.value}>
              <a href={contactsInfo.phoneHref}>{contactsInfo.phone}</a>
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>время</dt>
            <dd className={styles.value}>
              {contactsInfo.hoursDays} <span className={styles.nowrap}>{contactsInfo.hoursTime}</span>
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>соцсети</dt>
            <dd className={`${styles.value} ${styles.social}`}>
              {contactsInfo.socials.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <p className={styles.wordmark} aria-hidden>
          mvz friends
        </p>

        <div className={styles.bottom}>
          <span>© mvz friends 2026</span>
          <button type="button" className={styles.toTop} onClick={() => scrollToTop()}>
            <span className={styles.btnText}>наверх</span>
            <ArrowUp className={styles.arrowUp} strokeWidth={3} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  )
}
