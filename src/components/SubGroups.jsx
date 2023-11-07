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
      {groups.map((sub_group) => (
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
  )
}
