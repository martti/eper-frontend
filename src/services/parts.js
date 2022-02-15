import axios from 'axios'
const baseUrl = '/api'

const getMakes = async () => {
  return await axios.get(`${baseUrl}/makes`)
}

const getCatalogues = async (make) => {
  return await axios.get(`${baseUrl}/catalogues/${make}`)
}

const getGroups = async (catalogue) => {
  return await axios.get(`${baseUrl}/groups/${catalogue}`)
}

const getSubGroups = async (catalogue, group) => {
  return await axios.get(`${baseUrl}/sub_groups/${catalogue}/${group}`)
}

const getDrawings = async (catalogue, group, sub_group) => {
  return await axios.get(`${baseUrl}/drawings/${catalogue}/${group}/${sub_group}`)
}

export default { getMakes, getCatalogues, getGroups, getSubGroups, getDrawings }