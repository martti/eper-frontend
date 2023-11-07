import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'

export const Makes = () => {
  const [makes, setMakes] = useState([])

  useEffect(() => {
    partsService.getMakes().then((makes) => {
      setMakes(makes.data)
    })
  }, [])
  return (
    <>
      <BreadcrumbsElement />
      <div className="grid mb-12 grid-cols-4">
        {makes.map((make) => (
          <div
            key={make.make}
            className="flex flex-col p-4 text-center bg-white"
          >
            <Link
              to={`/models/${make.make}`}
              className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
            >
              <figcaption className="flex items-center space-x-3">
                <img className="rounded-full w-20 h-20" src={make.image} />
                <div className="space-y-0.5 font-medium text-left">
                  {make.description}
                </div>
              </figcaption>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
