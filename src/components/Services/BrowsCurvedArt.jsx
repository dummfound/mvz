import { useId } from 'react'
import styles from './ServiceCard.module.scss'

const PHRASE = 'оформление бровей и ресниц'

const PATHS = {
  main: 'M 7 82 C 95 95, 175 150, 200 240 S 232 380, 300 400 S 420 412, 470 414',
  loopLeft:
    'M -8 606 C 80 594, 165 570, 222 512 S 302 420, 306 350 S 292 292, 240 285 S 110 272, 20 245 S -30 226, -60 218',
  loopRight:
    'M 392 580 C 360 540, 330 490, 340 440 S 440 300, 466 225 C 472 160, 455 105, 420 62 S 330 15, 250 -8',
}

export function BrowsCurvedArt() {
  const uid = useId().replace(/:/g, '')
  const id = (name) => `brows-${uid}-${name}`

  return (
    <svg
      className={styles.browsArt}
      viewBox="0 0 476 622"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
      focusable="false"
    >
      <defs>
        {Object.entries(PATHS).map(([name, d]) => (
          <path key={name} id={id(name)} d={d} fill="none" />
        ))}
      </defs>

      <g className={styles.browsPink}>
        <text>
          <textPath href={`#${id('loopLeft')}`}>
            {PHRASE} {PHRASE}
          </textPath>
        </text>
        <text>
          <textPath href={`#${id('loopRight')}`}>
            {PHRASE} оформление бровей и
          </textPath>
        </text>
      </g>

      <text className={styles.browsMain}>
        <textPath href={`#${id('main')}`}>{PHRASE}</textPath>
      </text>
    </svg>
  )
}
