import { bookingUrl } from '../../data/content.js'
import { images } from '../../data/images.js'
import { BrowsCurvedArt } from './BrowsCurvedArt.jsx'
import styles from './ServiceCard.module.scss'

const variants = {
  women: 'women',
  coloring: 'coloring',
  man: 'man',
  nails: 'nails',
  brows: 'brows',
}

export function ServiceCard({ variant, title, pills, image }) {
  const hasImage = Boolean(image)

  return (
    <article
      className={`${styles.card} ${styles[variants[variant]]} ${hasImage ? styles.withImage : ''}`}
      style={hasImage ? { '--card-image': `url(${image})` } : undefined}
    >
      {variant === 'women' && (
        <svg
          className={styles.womenArt}
          viewBox="0 0 344 450"
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
        >
          <text className={styles.womenBig} x="0" y="187" textLength="344" lengthAdjust="spacingAndGlyphs">
            женские
          </text>
          <text
            className={styles.womenBig}
            x="0"
            y="397"
            textLength="344"
            lengthAdjust="spacingAndGlyphs"
            style={{ fontSize: 212 }}
          >
            стрижки
          </text>
          {[34, 229, 432].map((y) => (
            <text
              key={y}
              className={styles.womenSmall}
              x="5"
              y={y}
              textLength="334"
              lengthAdjust="spacingAndGlyphs"
            >
              женские стрижки
            </text>
          ))}
        </svg>
      )}

      {variant === 'man' && (
        <>
          <svg
            className={styles.manWord}
            viewBox="1 33 102.1 67"
            preserveAspectRatio="none"
            aria-hidden
            focusable="false"
          >
            <text x="0" y="100">
              MAN
            </text>
          </svg>
          <ul className={styles.pills}>
            {pills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {variant === 'coloring' && (
        <div className={styles.coloringLabelWrap} aria-hidden>
          <img
            className={styles.coloringLabel}
            src={images.services.coloringLabel}
            alt=""
          />
        </div>
      )}
      {variant === 'nails' && (
        <div className={styles.nailsLabelWrap} aria-hidden>
          <p className={styles.nailsLabel}>
            <span>ногтевые</span>
            <span>услуги</span>
          </p>
        </div>
      )}
      {variant === 'brows' && <BrowsCurvedArt />}

      <a
        href={bookingUrl}
        className={styles.arrow}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Записаться: ${title}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden focusable="false">
          <path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </a>
    </article>
  )
}
