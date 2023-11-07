import axios from 'axios'
const baseUrl = '/api'

const getMakes = async () => {
  return await axios.get(`${baseUrl}/makes`)
}

const getCatalogues = async (make, model) => {
  return await axios.get(`${baseUrl}/catalogues/${make}/${model}`)
}

const getModels = async () => {
  return await axios.get(`${baseUrl}/models`)
}

const getGroups = async (catalogue) => {
  return await axios.get(`${baseUrl}/groups/${catalogue}`)
}

const getSubGroups = async (catalogue, group) => {
  return await axios.get(`${baseUrl}/sub_groups/${catalogue}/${group}`)
}

const getDrawings = async (catalogue, group, sub_group) => {
  return await axios.get(
    `${baseUrl}/drawings/${catalogue}/${group}/${sub_group}`
  )
}

const getParts = async (catalogue, group, sub_group, sgs_code) => {
  return await axios.get(
    `${baseUrl}/parts/${catalogue}/${group}/${sub_group}/${sgs_code}`
  )
}

const searchVin = async (vin) => {
  return await axios.get(`${baseUrl}/vin/${vin}`)
}

export default {
  getMakes,
  getCatalogues,
  getModels,
  getGroups,
  getSubGroups,
  getDrawings,
  getParts,
  searchVin
}
