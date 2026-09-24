import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header.jsx'
import { sectionPaths } from './data/content.js'
import { Home } from './pages/Home.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {sectionPaths.map((path) => (
          <Route key={path} path={path} element={<Home />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
