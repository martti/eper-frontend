import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import { Menu } from './components/Menu'
import { VinSearch } from './components/VinSearch'
import { Makes } from './components/Makes'
import { Catalogues } from './components/Catalogues'
import { Models } from './components/Models'
import { Groups } from './components/Groups'
import { SubGroups } from './components/SubGroups'
import { Drawings } from './components/Drawings'

const App = () => {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Navigate to="/makes" replace />} />
        <Route path="/makes" element={<Makes />} />
        <Route
          path="/drawings/:make/:model/:catalogue/:group/:sub_group"
          element={<Drawings />}
        />
        <Route path="/models/:make" element={<Models />} />
        <Route path="/catalogues/:make/:model/" element={<Catalogues />} />
        <Route path="/groups/:make/:model/:catalogue" element={<Groups />} />
        <Route
          path="/sub_groups/:make/:model/:catalogue/:group"
          element={<SubGroups />}
        />
        <Route path="/search" element={<VinSearch />} />
      </Routes>
    </Router>
  )
}

export default App
