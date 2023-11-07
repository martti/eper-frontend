import { useEffect, useState } from 'react'
import { Link, useParams, Outlet } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'

export const Groups = () => {
  const [groups, setGroups] = useState([])
  const { make, model, catalogue } = useParams()

  useEffect(() => {
    partsService.getGroups(catalogue).then((groups) => {
      setGroups(groups.data)
    })
  }, [catalogue])
  return (
    <>
      <BreadcrumbsElement make={make} model={model} catalogue={catalogue} />
      <div className="grid mb-12 grid-cols-4">
        {groups.map((group) => (
          <div key={group.code} className="flex flex-col p-4">
            <Link
              className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              to={`/sub_groups/${make}/${model}/${catalogue}/${group.code}`}
            >
              <figcaption className="flex items-center space-x-3">
                <img
                  className="rounded-full w-20 h-20"
                  src={group.image}
                  alt={group.description}
                />
                <div className="space-y-0.5 font-medium text-left">
                  {group.description}
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
