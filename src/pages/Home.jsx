import { About } from '../components/About/About.jsx'
import { Contacts } from '../components/Contacts/Contacts.jsx'
import { Gallery } from '../components/Gallery/Gallery.jsx'
import { Gifts } from '../components/Gifts/Gifts.jsx'
import { Hero } from '../components/Hero/Hero.jsx'
import { Philosophy } from '../components/Philosophy/Philosophy.jsx'
import { Services } from '../components/Services/Services.jsx'
import { Team } from '../components/Team/Team.jsx'
import { useScrollToSection } from '../hooks/useScrollToSection.js'
import styles from './Home.module.scss'

export function Home() {
  useScrollToSection()

  return (
    <>
      <main>
        <Hero />
        <About />
        <Philosophy />
        <Services />
        <div className={styles.giftsGallery}>
          <Gifts />
          <Gallery />
        </div>
        <Team />
        <Contacts />
      </main>
    </>
  )
}
