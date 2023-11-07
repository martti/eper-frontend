import { useState } from 'react'
import { Link } from 'react-router-dom'
import partsService from '../services/parts'

export const VinSearch = () => {
  const [vin, setVin] = useState('')
  const [results, setResults] = useState(null)

  const searchVin = (event) => {
    event.preventDefault()
    partsService.searchVin(vin).then((vins) => {
      setResults(vins.data)
    })
  }

  const patternTypeStyle = {
    fontWeight: 'bold',
    marginRight: 5
  }

  return (
    <>
      <div className="flex items-center p-4 space-x-2">
        <input
          className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          type="text"
          id="vin"
          label="Vin"
          onChange={({ target }) => setVin(target.value)}
        />
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={(event) => searchVin(event)}
        >
          Search VIN
        </button>
      </div>
      <div className="p-4">
        {results && (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Catalogue
                </th>
                <th scope="col" className="px-6 py-3">
                  Model
                </th>
                <th scope="col" className="px-6 py-3">
                  Series
                </th>
                <th scope="col" className="px-6 py-3">
                  Version
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Pattern
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((vinResult, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-6 py-4 align-top whitespace-nowrap">
                    <Link
                      to={`/groups/${vinResult.catalogue.make}/${vinResult.catalogue.model}/${vinResult.catalogue.code}`}
                    >
                      {vinResult.catalogue.description}
                    </Link>
                  </td>
                  <td className="px-6 py-4 align-top">{vinResult.model}</td>
                  <td className="px-6 py-4 align-top">{vinResult.series}</td>
                  <td className="px-6 py-4 align-top">{vinResult.version}</td>
                  <td className="px-6 py-4 align-top">
                    {vinResult.description}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div>
                      {vinResult.pattern.map((attribute, index) => (
                        <div key={index}>
                          {attribute[1] && (
                            <span style={patternTypeStyle}>{attribute[1]}</span>
                          )}
                          <span>- {attribute[2]}</span>
                          <span> ({attribute[0]})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
