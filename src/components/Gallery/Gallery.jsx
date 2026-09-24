import { galleryItems } from '../../data/content.js'
import styles from './Gallery.module.scss'

function GalleryCard({ item, featured = false }) {
  return (
    <li className={`${styles.item} ${featured ? styles.itemFeatured : ''}`}>
      <img
        className={styles.media}
        src={item.image}
        alt={item.title}
        loading="lazy"
      />
    </li>
  )
}

export function Gallery() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.watermark} aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>преображения</span>
        ))}
      </div>

      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>образы</h2>
        <ul className={styles.grid}>
          <GalleryCard item={galleryItems.featured} featured />
          {galleryItems.items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
