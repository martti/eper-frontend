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
    <div style={{ padding: 20 }}>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        type="text"
        id="vin"
        label="Vin"
        onChange={({ target }) => setVin(target.value)}
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        onClick={(event) => searchVin(event)}
      >
        Search VIN
      </button>

      {results && (
        <table>
          <thead>
            <tr>
              <th>Catalogue</th>
              <th>Model</th>
              <th>Series</th>
              <th>Version</th>
              <th>Description</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            {results.map((vinResult, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: 'top' }}>
                  <Link
                    to={`/groups/${vinResult.catalogue.make}/${vinResult.catalogue.model}/${vinResult.catalogue.code}`}
                  >
                    {vinResult.catalogue.description}
                  </Link>
                </td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.model}</td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.series}</td>
                <td style={{ verticalAlign: 'top' }}>{vinResult.version}</td>
                <td style={{ verticalAlign: 'top' }}>
                  {vinResult.description}
                </td>
                <td>
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

      {results && <div>{results.catalogue}</div>}
    </div>
  )
}
