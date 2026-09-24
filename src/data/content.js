import { images } from './images.js'

export const promoText = 'СКИДКА 20% НА ПЕРВЫЙ ВИЗИТ |'

export const bookingUrl = 'https://dikidi.net/1765251'

export const navItems = [
  { path: '/about', sectionId: 'about', label: 'кто мы?' },
  { path: '/services', sectionId: 'services', label: 'услуги' },
  { path: '/gifts', sectionId: 'gifts', label: 'подарки' },
  { path: '/gallery', sectionId: 'gallery', label: 'образы' },
  { path: '/team', sectionId: 'team', label: 'команда' },
  { path: '/contacts', sectionId: 'contacts', label: 'контакты' },
]

export const sectionPaths = ['/', ...navItems.map((item) => item.path)]

export const manServices = [
  'стрижка',
  'оформление бороды',
  'коррекция бровей',
  'маникюр',
  'педикюр',
]

export const desires = ['вдохновлять', 'найти себя', 'блистать']

export const teamMembers = [
  {
    id: 1,
    name: 'иванов владимир',
    role: 'барбер',
    note: 'амбассадор бренда kondor',
    photo: images.team.ivanov,
  },
  {
    id: 2,
    name: 'стилист',
    role: 'парикмахер',
    note: '',
    photo: images.team.member2,
  },
  {
    id: 3,
    name: 'колорист',
    role: 'стилист',
    note: '',
    photo: images.team.member3,
  },
]

export const galleryItems = {
  featured: {
    id: 'featured',
    title: 'преображения',
    image: images.gallery.featured,
  },
  items: images.gallery.items.map((image, index) => ({
    id: index + 1,
    title: 'преображения',
    image,
  })),
}

export const serviceCards = [
  { variant: 'women', title: 'женские стрижки' },
  { variant: 'coloring', title: 'окрашивание', image: images.services.coloring },
  { variant: 'man', title: 'MAN', pills: manServices, image: images.services.man },
  { variant: 'nails', title: 'ногтевые услуги', image: images.services.nails },
  { variant: 'brows', title: 'оформление бровей и ресниц' },
]
