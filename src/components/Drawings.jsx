import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import partsService from '../services/parts'
import { BreadcrumbsElement } from './BreadcrumbsElement'
import { Parts } from './Parts'

export const Drawings = () => {
  const [drawings, setDrawings] = useState([])
  const { make, model, catalogue, group, sub_group } = useParams()

  useEffect(() => {
    partsService.getDrawings(catalogue, group, sub_group).then((drawings) => {
      setDrawings(drawings.data)
    })
  }, [catalogue, group, sub_group])
  return (
    <>
      <BreadcrumbsElement
        make={make}
        model={model}
        catalogue={catalogue}
        group={group}
        sub_group={sub_group}
      />
      <table>
        <tbody>
          {drawings.map((drawing, index) => (
            <tr key={index}>
              <td style={{ width: 400 }}>
                <img
                  style={{ maxWidth: '400px' }}
                  src={`${drawing.image}`}
                  alt={drawing.description}
                />
              </td>
              <td align="left" style={{ verticalAlign: 'top' }}>
                <div>
                  {drawing.code} {drawing.description}
                </div>
                <div>{drawing.pattern}</div>
                <Parts drawing={drawing} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
