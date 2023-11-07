import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'

export const Models = () => {
  const [models, setModels] = useState([])
  const { make } = useParams()

  useEffect(() => {
    partsService.getModels().then((models) => {
      setModels(
        models.data
          .sort((a, b) => a.sort_key - b.sort_key)
          .filter((m) => m.make === make)
      )
    })
  }, [make])
  return (
    <>
      <BreadcrumbsElement make={make} />
      <div className="grid mb-12 grid-cols-4">
        {models.map((model) => (
          <div key={model.model} className="flex flex-col p-4 bg-white">
            <Link
              className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              to={`/catalogues/${make}/${model.model}`}
            >
              <figcaption className="flex items-center space-x-3">
                <img
                  className="rounded-full w-20 h-20"
                  src={model.image}
                  alt={model.description}
                />
                <div className="space-y-0.5 font-medium text-left">
                  {model.description}
                </div>
              </figcaption>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
