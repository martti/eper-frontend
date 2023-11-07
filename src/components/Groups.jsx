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
      {groups.map((group) => (
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
  )
}
