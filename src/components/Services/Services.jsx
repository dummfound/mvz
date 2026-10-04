import useEmblaCarousel from 'embla-carousel-react'
import { serviceCards } from '../../data/content.js'
import { ServiceCard } from './ServiceCard.jsx'
import styles from './Services.module.scss'

export function Services() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    duration: 40,
    skipSnaps: false,
    breakpoints: {
      '(min-width: 600px)': { active: false },
    },
  })

  return (
    <section id="services" className={styles.services}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>услуги</h2>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>
            {serviceCards.map((card) => (
              <div key={card.variant} className={styles.slide}>
                <ServiceCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
