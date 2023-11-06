import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router, Route, Routes, NavLink, Link, useParams, Outlet, Navigate
} from 'react-router-dom'
import partsService from './services/parts'

const Makes = () => {
  const [makes, setMakes] = useState([])

  useEffect(() => {
    partsService.getMakes()
      .then(makes => {
        setMakes(makes.data)
      })
  }, [])
  return <>

    <BreadcrumbsElement />
    <div className="grid mb-12 grid-cols-4">

      {makes.map(make => (
        <div key={make.make} className="flex flex-col p-4 text-center bg-white">
          <Link to={`/models/${make.make}`} className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <figcaption className="flex items-center space-x-3">

              <img className="rounded-full w-20 h-20" src={make.image} />
              <div className="space-y-0.5 font-medium text-left">{make.description}</div>
            </figcaption>
          </Link>
        </div>

      ))}
    </div>
  </>
}

const CrumbItem = ({ linkTo, description, show }) => {
  return show ? <li>
    <div className="flex items-center">
      <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
      </svg>
      <Link className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600" to={linkTo}>{description}</Link></div>
  </li>
    :
    description &&
    <li>
      <div className="flex items-center">
        <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span className="text-sm font-medium text-gray-500">{description}</span>
      </div>
    </li>
}

const BreadcrumbsElement = ({ make, model, catalogue, group, sub_group }) => {
  const [makeDescription, setMake] = useState('')
  const [modelDescription, setModel] = useState('')
  const [catalogueDescription, setCatalogue] = useState('')
  const [groupDescription, setGroup] = useState('')
  const [subGroupDescription, setSubGroup] = useState('')

  useEffect(() => {
    if (make) {
      partsService.getMakes()
        .then(makes => {
          const selectedMake = makes.data.find(m => m.make === make)
          setMake(selectedMake.description)
        })
      if (model) {
        partsService.getModels()
          .then(models => {
            const selectedModel = models.data.find(m => m.model === model)
            setModel(selectedModel.description)
          })

        if (catalogue) {
          partsService.getCatalogues(make, model)
            .then(catalogues => {
              const selectedCatalogue = catalogues.data.find(m => m.code === catalogue)
              setCatalogue(selectedCatalogue.description)
            })
          if (group) {
            partsService.getGroups(catalogue)
              .then(groups => {
                const selectedGroup = groups.data.find(m => m.code === group)
                setGroup(selectedGroup.description)
              })
            if (sub_group) {
              partsService.getSubGroups(catalogue, group)
                .then(groups => {
                  const selectedSubGroup = groups.data.find(m => m.code === sub_group)
                  setSubGroup(selectedSubGroup.description)
                })

            }

          }
        }
      }
    }
  }, [make, model, catalogue, group, sub_group])

  let showMake = false
  let showModel = false
  let showCatalogue = false
  let showGroup = false
  let showSubGroup = false
  if (model) {
    showMake = true
    if (catalogue) {
      showModel = true
      if (group) {
        showCatalogue = true
        if (sub_group) {
          showGroup = true
          showSubGroup = true
        }
      }
    }
  }

  return <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-3">
      <li className="inline-flex items-center">
        <Link to="/makes" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
        Makes
        </Link>
      </li>

      <CrumbItem show={showMake} linkTo={`/models/${make}`} description={makeDescription} />
      <CrumbItem show={showModel} linkTo={`/catalogues/${make}/${model}`} description={modelDescription} />
      <CrumbItem show={showCatalogue} linkTo={`/groups/${make}/${model}/${catalogue}`} description={catalogueDescription} />
      <CrumbItem show={showGroup} linkTo={`/sub_groups/${make}/${model}/${catalogue}/${group}`} description={groupDescription} />

      {showSubGroup && <li>
        <div className="flex items-center">
          <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span className="text-sm font-medium text-gray-500">{subGroupDescription}</span>
        </div>
      </li>}
    </ol>
  </nav>

}

const Catalogues = () => {
  const [catalogues, setCatalogues] = useState([])
  const { make, model } = useParams()

  useEffect(() => {
    partsService.getCatalogues(make, model)
      .then(catalogues => {
        setCatalogues(
          catalogues.data.sort((a, b) => a.sort_key - b.sort_key)
        )
      })
  }, [make, model])
  return <>
    <BreadcrumbsElement make={make} model={model} />
    <div className="grid mb-12 grid-cols-4">
      {catalogues.map(catalogue => (
        <div key={catalogue.code} className="flex flex-col p-4 bg-white">
          <Link
            className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"        to={`/groups/${make}/${model}/${catalogue.code}`}
          >
            <figcaption className="flex items-center space-x-3">
              <img className="rounded-full w-20 h-20" src={catalogue.image} alt={catalogue.description} />
              <div className="space-y-0.5 font-medium text-left">{catalogue.description}</div>
            </figcaption>

          </Link>
        </div>
      ))}
    </div>
  </>
}

const Models = () => {
  const [models, setModels] = useState([])
  const { make } = useParams()

  useEffect(() => {
    partsService.getModels()
      .then(models => {
        setModels(models.data
          .sort((a, b) => a.sort_key - b.sort_key)
          .filter((m) => m.make === make))
      })
  }, [make])
  return <>
    <BreadcrumbsElement make={make} />
    <div className="grid mb-12 grid-cols-4">
      {models.map(model => (
        <div key={model.model} className="flex flex-col p-4 bg-white">
          <Link
            className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
            to={`/catalogues/${make}/${model.model}`}
          >
            <figcaption className="flex items-center space-x-3">
              <img className="rounded-full w-20 h-20" src={model.image} alt={model.description} />
              <div className="space-y-0.5 font-medium text-left">{model.description}</div>
            </figcaption>
          </Link>
        </div>
      ))}
    </div>
  </>
}

const Groups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue } = useParams()

  useEffect(() => {
    partsService.getGroups(catalogue)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [catalogue])
  return <>
    <BreadcrumbsElement make={make} model={model} catalogue={catalogue} />
    {groups.map(group => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/sub_groups/${make}/${model}/${catalogue}/${group.code}`}
        key={group.code}
      >
        {group.description}
      </Link>
    ))}
    <Outlet />
  </>
}

const SubGroups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue, group } = useParams()

  useEffect(() => {
    partsService.getSubGroups(catalogue, group)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [catalogue, group])
  return <>
    <BreadcrumbsElement make={make} model={model} catalogue={catalogue} group={group} />
    {groups.map(sub_group => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/drawings/${make}/${model}/${catalogue}/${group}/${sub_group.code}`}
        key={sub_group.code}
      >
        {sub_group.description}
      </Link>
    ))}
    <Outlet />
  </>
}

const Parts = ({ drawing }) => {
  const [parts, setParts] = useState([])

  useEffect(() => {
    partsService.getParts(drawing.catalogue, drawing.group, drawing.sub_group, drawing.sgs_code)
      .then(parts => {
        setParts(parts.data)
      })
  }, [drawing.catalogue, drawing.group, drawing.sub_group, drawing.sgs_code])

  return <div>
    <table>
      <thead>
        <tr>
          <th>Image#</th>
          <th>Code</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        {parts.map((part, index) => (
          <tr key={index}>
            <td>{part.drawing_part_number}</td>
            <td>{part.part_code}</td>
            <td>{part.qty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

const Drawings = () => {
  const [drawings, setDrawings] = useState([])
  const { make, model, catalogue, group, sub_group } = useParams()

  useEffect(() => {
    partsService.getDrawings(catalogue, group, sub_group)
      .then(drawings => {
        setDrawings(drawings.data)
      })
  }, [catalogue, group, sub_group])
  return <>
    <BreadcrumbsElement make={make} model={model} catalogue={catalogue} group={group} sub_group={sub_group} />
    <table>
      <tbody>
        {drawings.map((drawing, index) => (
          <tr key={index}>
            <td style={{ width: 400 }}>
              <img style={{ maxWidth: '400px' }} src={`${drawing.image}`} alt={drawing.description} />
            </td>
            <td align="left" style={{ verticalAlign: 'top' }}>
              <div>{drawing.code} {drawing.description}</div>
              <div>{drawing.pattern}</div>
              <Parts drawing={drawing} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
}

const VinSearch = () => {
  const [vin, setVin] = useState('')
  const [results, setResults] = useState(null)

  const searchVin = (event) => {
    event.preventDefault()
    partsService.searchVin(vin)
      .then(vins => {
        setResults(vins.data)
      })
  }

  const patternTypeStyle = {
    fontWeight: 'bold',
    marginRight: 5,
  }

  return <div style={{ padding: 20 }}>
    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="text" id="vin" label="Vin" onChange={({ target }) => setVin(target.value)} />
    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" onClick={(event) => searchVin(event)}>Search VIN</button>

    {results &&
        <table>
          <thead>
            <tr>
              <th>Catalogue</th>
              <th>Model</th>
              <th>Series</th>
              <th>Version</th>
              <th>Description</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            {results.map((vinResult, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: 'top' }}><Link to={`/groups/${vinResult.catalogue.make}/${vinResult.catalogue.model}/${vinResult.catalogue.code}`}>{vinResult.catalogue.description}</Link></td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.model}</td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.series}</td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.version}</td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.description}</td>
                <td>
                  <div>
                    {vinResult.pattern.map((attribute, index) => (
                      <div key={index}>
                        {attribute[1] && <span style={patternTypeStyle}>{attribute[1]}</span>}
                        <span>- {attribute[2]}</span>
                        <span> ({attribute[0]})</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    }

    {results && <div>{results.catalogue}</div>}
  </div>
}

// const Main = () => {
//   return <h1>Main</h1>
// }

const Menu = () => {
  return (
    <nav className="bg-gray border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        ePer parts
        <div className="w-auto" id="navbar-default">
          <ul className="flex flex-row space-x-8 mt-0 border-0 bg-white">
            <li>
              <NavLink to="/makes" className={({ isActive }) => isActive ? 'text-blue-700 p-0' : 'hover:text-blue-700 p-0'}>makes</NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'text-blue-700 p-0' : 'hover:text-blue-700 p-0'}>vin search</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  )
}

const App = () => {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Navigate to='/makes' replace />} />
        <Route path="/makes" element={<Makes />} />
        <Route path="/drawings/:make/:model/:catalogue/:group/:sub_group" element={<Drawings />} />
        <Route path="/models/:make" element={<Models />} />
        <Route path="/catalogues/:make/:model/" element={<Catalogues />} />
        <Route path="/groups/:make/:model/:catalogue" element={<Groups />} />
        <Route path="/sub_groups/:make/:model/:catalogue/:group" element={<SubGroups />} />
        <Route path="/search" element={<VinSearch />} />
      </Routes>
    </Router>
  )
}

export default App
