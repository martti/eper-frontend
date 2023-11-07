import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import partsService from '../services/parts'
import { CrumbItem } from './CrumbItem'

export const BreadcrumbsElement = ({
  make,
  model,
  catalogue,
  group,
  sub_group
}) => {
  const [makeDescription, setMake] = useState('')
  const [modelDescription, setModel] = useState('')
  const [catalogueDescription, setCatalogue] = useState('')
  const [groupDescription, setGroup] = useState('')
  const [subGroupDescription, setSubGroup] = useState('')

  useEffect(() => {
    if (make) {
      partsService.getMakes().then((makes) => {
        const selectedMake = makes.data.find((m) => m.make === make)
        setMake(selectedMake.description)
      })
      if (model) {
        partsService.getModels().then((models) => {
          const selectedModel = models.data.find((m) => m.model === model)
          setModel(selectedModel.description)
        })

        if (catalogue) {
          partsService.getCatalogues(make, model).then((catalogues) => {
            const selectedCatalogue = catalogues.data.find(
              (m) => m.code === catalogue
            )
            setCatalogue(selectedCatalogue.description)
          })
          if (group) {
            partsService.getGroups(catalogue).then((groups) => {
              const selectedGroup = groups.data.find((m) => m.code === group)
              setGroup(selectedGroup.description)
            })
            if (sub_group) {
              partsService.getSubGroups(catalogue, group).then((groups) => {
                const selectedSubGroup = groups.data.find(
                  (m) => m.code === sub_group
                )
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

  return (
    <nav
      className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-100"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/makes"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Makes
          </Link>
        </li>

        <CrumbItem
          show={showMake}
          linkTo={`/models/${make}`}
          description={makeDescription}
        />
        <CrumbItem
          show={showModel}
          linkTo={`/catalogues/${make}/${model}`}
          description={modelDescription}
        />
        <CrumbItem
          show={showCatalogue}
          linkTo={`/groups/${make}/${model}/${catalogue}`}
          description={catalogueDescription}
        />
        <CrumbItem
          show={showGroup}
          linkTo={`/sub_groups/${make}/${model}/${catalogue}/${group}`}
          description={groupDescription}
        />

        {showSubGroup && (
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mx-1 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="text-sm font-medium text-gray-500">
                {subGroupDescription}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  )
}
