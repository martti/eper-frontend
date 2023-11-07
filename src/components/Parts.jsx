import { useEffect, useState } from 'react'
import partsService from '../services/parts'

export const Parts = ({ drawing }) => {
  const [parts, setParts] = useState([])

  useEffect(() => {
    partsService
      .getParts(
        drawing.catalogue,
        drawing.group,
        drawing.sub_group,
        drawing.sgs_code
      )
      .then((parts) => {
        setParts(parts.data)
      })
  }, [drawing.catalogue, drawing.group, drawing.sub_group, drawing.sgs_code])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Image#</th>
            <th>Code</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <tr key={index}>
              <td>{part.drawing_part_number}</td>
              <td>{part.part_code}</td>
              <td>{part.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
