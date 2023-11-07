import { useEffect, useState } from 'react'
import { Link, useParams, Outlet } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'

export const SubGroups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue, group } = useParams()

  useEffect(() => {
    partsService.getSubGroups(catalogue, group).then((groups) => {
      setGroups(groups.data)
    })
  }, [catalogue, group])
  return (
    <>
      <BreadcrumbsElement
        make={make}
        model={model}
        catalogue={catalogue}
        group={group}
      />
      <div className="grid mb-12 grid-cols-4">
        {groups.map((sub_group) => (
          <div key={sub_group.code} className="flex flex-col p-4">
            <Link
              className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              to={`/drawings/${make}/${model}/${catalogue}/${group}/${sub_group.code}`}
            >
              <figcaption className="flex items-center space-x-3">
                <div className="space-y-0.5 font-medium text-left">
                  {sub_group.description}
                </div>
              </figcaption>
            </Link>
          </div>
        ))}
      </div>
      <Outlet />
    </>
  )
}
