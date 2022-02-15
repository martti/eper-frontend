import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router, Route, Routes, Link, useParams, Outlet
} from 'react-router-dom'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
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
        to={`/makes/${make.make}`}
        key={make.make}
      >
        {make.description}
      </Link>
    ))}
  </Paper>
}

const BreadcrumbsElement = ({ make, catalogue, group, sub_group }) => {
  const [makeDescription, setMake] = useState('')
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
      if (catalogue) {
        partsService.getCatalogues(make)
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
  }, [])

  let showMake = false
  let showCatalogue = false
  let showGroup = false
  let showSubGroup = false
  if (catalogue) {
    showMake = true
    if (group) {
      showCatalogue = true
      if (sub_group) {
        showGroup = true
        showSubGroup = true
      }
    }
  }

  return <Breadcrumbs aria-label="breadcrumb">
    <Link to="/makes">Makes</Link>
    {showMake ? <Link to={`/makes/${make}`}>{makeDescription}</Link> : <Typography color="text.primary">{makeDescription}</Typography>}
    {showCatalogue ? <Link to={`/groups/${make}/${catalogue}`}>{catalogueDescription}</Link> : <Typography color="text.primary">{catalogueDescription}</Typography>}
    {showGroup ? <Link to={`/sub_groups/${make}/${catalogue}/${group}`}>{groupDescription}</Link> : <Typography color="text.primary">{groupDescription}</Typography>}
    {showSubGroup && <Typography color="text.primary">{subGroupDescription}</Typography>}
  </Breadcrumbs>
}

const Catalogues = () => {
  const [catalogues, setCatalogues] = useState([])
  const { make } = useParams()

  useEffect(() => {
    partsService.getCatalogues(make)
      .then(catalogues => {
        setCatalogues(catalogues.data)
      })
  }, [])
  return <Paper style={{ padding: 20 }}>
    <BreadcrumbsElement make={make} />
    {catalogues.map(catalogue => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/groups/${make}/${catalogue.code}`}
        key={catalogue.code}
      >
        {catalogue.description}
      </Link>
    ))}
  </Paper>
}

const Groups = () => {
  const [groups, setGroups] = useState([])
  const { make, catalogue } = useParams()

  useEffect(() => {
    partsService.getGroups(catalogue)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [])
  return <Paper style={{ padding: 20 }}>
    <BreadcrumbsElement make={make} catalogue={catalogue} />
    {groups.map(group => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/sub_groups/${make}/${catalogue}/${group.code}`}
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
  const { make, catalogue, group } = useParams()

  useEffect(() => {
    partsService.getSubGroups(catalogue, group)
      .then(groups => {
        setGroups(groups.data)
      })
  }, [group])
  return <Paper style={{ padding: 20 }}>
    <BreadcrumbsElement make={make} catalogue={catalogue} group={group} />
    {groups.map(sub_group => (
      <Link
        style={{ display: 'block', margin: '1rem 0' }}
        to={`/drawings/${make}/${catalogue}/${group}/${sub_group.code}`}
        key={sub_group.code}
      >
        {sub_group.description}
      </Link>
    ))}
    <Outlet />
  </Paper>
}

const Drawings = () => {
  const [drawings, setDrawings] = useState([])
  const { make, catalogue, group, sub_group } = useParams()

  useEffect(() => {
    partsService.getDrawings(catalogue, group, sub_group)
      .then(drawings => {
        setDrawings(drawings.data)
      })
  }, [sub_group])
  return <Paper style={{ padding: 20 }}>
    <TableContainer>
      <BreadcrumbsElement make={make} catalogue={catalogue} group={group} sub_group={sub_group} />
      <Table>
        <TableBody>
          {drawings.map((drawing, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: 400 }}>
                <img style={{ maxWidth: '400px' }} src={`${drawing.image}`} alt={drawing.description} />
              </TableCell>
              <TableCell align="left" style={{ verticalAlign: 'top' }}>
                <div>{drawing.code} {drawing.description}</div>
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

  useEffect(() => {
    // partsService.searchVin(vin)
    //   .then(makes => {
    //     setMakes(makes.data)
    //   })
  }, [])

  const searchVin = (event) => {
    event.preventDefault()
    partsService.searchVin(vin)
      .then(vins => {
        console.log(vins.data)
        setResults(vins.data)
      })
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
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((vinResult, index) => (
              <TableRow key={index}>
                <TableCell>{vinResult.catalogue}</TableCell>
                <TableCell>{vinResult.model}</TableCell>
                <TableCell>{vinResult.series}</TableCell>
                <TableCell>{vinResult.version}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    }

    {results && <div>{results.catalogue}</div>}
  </Paper>
}

const Main = () => {
  return <h1>Main</h1>
}

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
          <Route path="/" element={<Main />} />
          <Route path="/makes" element={<Makes />} />
          <Route path="/drawings/:make/:catalogue/:group/:sub_group" element={<Drawings />} />
          <Route path="/makes/:make" element={<Catalogues />} />
          <Route path="/groups/:make/:catalogue" element={<Groups />} />
          <Route path="/sub_groups/:make/:catalogue/:group" element={<SubGroups />} />
          <Route path="/search" element={<VinSearch />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
