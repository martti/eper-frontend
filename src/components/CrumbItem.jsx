import { Link } from 'react-router-dom'

export const CrumbItem = ({ linkTo, description, show }) => {
  return show ? (
    <li>
      <div className="flex items-center">
        <svg
          className="w-3 h-3 mx-1 text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <Link
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          to={linkTo}
        >
          {description}
        </Link>
      </div>
    </li>
  ) : (
    description && (
      <li>
        <div className="flex items-center">
          <svg
            className="w-3 h-3 mx-1 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="text-sm font-medium text-gray-500">
            {description}
          </span>
        </div>
      </li>
    )
  )
}
