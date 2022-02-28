import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router, Route, Routes, Link, useParams, Outlet, Navigate
} from 'react-router-dom'
import {
  Container, AppBar, Toolbar,
  Typography, Box, Button, Paper, Breadcrumbs,
  TableContainer, Table, TableCell, TableBody, TableHead, TableRow,
  TextField,
} from '@mui/material'
import partsService from './services/parts'

const Makes = () => {
  const [makes, setMakes] = useState([])

  useEffect(() => {
    partsService.getMakes()
      .then(makes => {
        setMakes(makes.data)
      })
  }, [])
  return <Paper style={{ padding: 20 }}>

    {makes.map(make => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/models/${make.make}`}
        key={make.make}
      >
        {make.description}
      </Link>
    ))}
  </Paper>
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
  }, [])

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

  return <Breadcrumbs aria-label="breadcrumb">
    <Link to="/makes">Makes</Link>
    {showMake ? <Link to={`/models/${make}`}>{makeDescription}</Link> : <Typography color="text.primary">{makeDescription}</Typography>}
    {showModel ? <Link to={`/catalogues/${make}/${model}`}>{modelDescription}</Link> : <Typography color="text.primary">{modelDescription}</Typography>}
    {showCatalogue ? <Link to={`/groups/${make}/${model}/${catalogue}`}>{catalogueDescription}</Link> : <Typography color="text.primary">{catalogueDescription}</Typography>}
    {showGroup ? <Link to={`/sub_groups/${make}/${model}/${catalogue}/${group}`}>{groupDescription}</Link> : <Typography color="text.primary">{groupDescription}</Typography>}
    {showSubGroup && <Typography color="text.primary">{subGroupDescription}</Typography>}
  </Breadcrumbs>
}

// eslint-disable-next-line no-unused-vars
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
  }, [])
  return <Paper style={{ padding: 20 }}>
    <BreadcrumbsElement make={make} model={model} />
    {catalogues.map(catalogue => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/groups/${make}/${model}/${catalogue.code}`}
        key={catalogue.code}
      >
        {catalogue.description}
      </Link>
    ))}
  </Paper>
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
  }, [])
  return <Paper style={{ padding: 20 }}>
    <BreadcrumbsElement make={make} />
    {models.map(model => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/catalogues/${make}/${model.model}`}
        key={model.model}
      >
        {model.description}
        {/* <img src={model.image} alt={model.description} /> */}
      </Link>
    ))}
  </Paper>
}

const Groups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue } = useParams()

  useEffect(() => {
    partsService.getGroups(catalogue)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [])
  return <Paper style={{ padding: 20 }}>
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
  </Paper>
}

const SubGroups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue, group } = useParams()

  useEffect(() => {
    partsService.getSubGroups(catalogue, group)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [group])
  return <Paper style={{ padding: 20 }}>
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
  </Paper>
}

const Parts = ({ drawing }) => {
  const [parts, setParts] = useState([])

  useEffect(() => {
    partsService.getParts(drawing.catalogue, drawing.group, drawing.sub_group, drawing.sgs_code)
      .then(parts => {
        setParts(parts.data)
      })
  }, [])

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
  }, [sub_group])
  return <Paper style={{ padding: 20 }}>
    <TableContainer>
      <BreadcrumbsElement make={make} model={model} catalogue={catalogue} group={group} sub_group={sub_group} />
      <Table>
        <TableBody>
          {drawings.map((drawing, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: 400 }}>
                <img style={{ maxWidth: '400px' }} src={`${drawing.image}`} alt={drawing.description} />
              </TableCell>
              <TableCell align="left" style={{ verticalAlign: 'top' }}>
                <div>{drawing.code} {drawing.description}</div>
                <div>{drawing.pattern}</div>
                <Parts drawing={drawing} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper >
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

  return <Paper style={{ padding: 20 }}>
    <TextField id="vin" label="Vin" variant="outlined" onChange={({ target }) => setVin(target.value)} />
    <Button onClick={(event) => searchVin(event)}>Search VIN</Button>

    {results &&
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Catalogue</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Pattern</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((vinResult, index) => (
              <TableRow key={index}>
                <TableCell style={{ verticalAlign: 'top' }}><Link to={`/groups/${vinResult.catalogue.make}/${vinResult.catalogue.model}/${vinResult.catalogue.code}`}>{vinResult.catalogue.description}</Link></TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>{vinResult.model}</TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>{vinResult.series}</TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>{vinResult.version}</TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>{vinResult.description}</TableCell>
                <TableCell>
                  <div>
                    {vinResult.pattern.map((attribute, index) => (
                      <div key={index}>
                        {attribute[1] && <span style={patternTypeStyle}>{attribute[1]}</span>}
                        <span>- {attribute[2]}</span>
                        <span> ({attribute[0]})</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    }

    {results && <div>{results.catalogue}</div>}
  </Paper>
}

// const Main = () => {
//   return <h1>Main</h1>
// }

const Menu = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>ePER parts</Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/makes">makes</Button>
          <Button color="inherit" component={Link} to="/search">vin search</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

const App = () => {
  return (
    <Container maxWidth="lg">
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
    </Container>
  )
}

export default App
