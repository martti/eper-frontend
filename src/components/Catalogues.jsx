import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'

export const Catalogues = () => {
  const [catalogues, setCatalogues] = useState([])
  const { make, model } = useParams()

  useEffect(() => {
    partsService.getCatalogues(make, model).then((catalogues) => {
      setCatalogues(catalogues.data.sort((a, b) => a.sort_key - b.sort_key))
    })
  }, [make, model])
  return (
    <>
      <BreadcrumbsElement make={make} model={model} />
      <div className="grid mb-12 grid-cols-4">
        {catalogues.map((catalogue) => (
          <div key={catalogue.code} className="flex flex-col p-4 bg-white">
            <Link
              className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              to={`/groups/${make}/${model}/${catalogue.code}`}
            >
              <figcaption className="flex items-center space-x-3">
                <img
                  className="rounded-full w-20 h-20"
                  src={catalogue.image}
                  alt={catalogue.description}
                />
                <div className="space-y-0.5 font-medium text-left">
                  {catalogue.description}
                </div>
              </figcaption>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
