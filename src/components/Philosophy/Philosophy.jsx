import { desires } from '../../data/content.js'

import { images } from '../../data/images.js'

import styles from './Philosophy.module.scss'



export function Philosophy() {

  return (

    <section className={styles.block} aria-label="Философия салона">

      <img className={styles.bg} src={images.philosophy} alt="" decoding="async" />

      <div className={styles.overlay} aria-hidden />

      <div className={styles.inner}>

        <div className={styles.content}>

          <p className={styles.line1}>

            mvz - это не про тренды. мы про вас, здесь и сейчас.

          </p>

          <p className={styles.line2}>чего вы искренне хотите?</p>

          <ul className={styles.tags}>

            {desires.map((item) => (

              <li key={item}>

                <button type="button">{item}</button>

              </li>

            ))}

          </ul>

        </div>

      </div>

    </section>

  )

}

