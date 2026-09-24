import { serviceCards } from '../../data/content.js'
import { ServiceCard } from './ServiceCard.jsx'
import styles from './Services.module.scss'

export function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>услуги</h2>
        <div className={styles.grid}>
          {serviceCards.map((card) => (
            <ServiceCard key={card.variant} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
