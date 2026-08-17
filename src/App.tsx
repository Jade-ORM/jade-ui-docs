import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import API from './pages/API'
import Examples from './pages/Examples'
import Plugins from './pages/Plugins'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:section" element={<Docs />} />
          <Route path="/api" element={<API />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
