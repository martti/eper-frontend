import { NavLink } from 'react-router-dom'

export const Menu = () => {
  return (
    <nav className="bg-gray border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        ePer parts
        <div className="w-auto" id="navbar-default">
          <ul className="flex flex-row space-x-8 mt-0 border-0 bg-white">
            <li>
              <NavLink
                to="/makes"
                className={({ isActive }) =>
                  isActive ? 'text-blue-700 p-0' : 'hover:text-blue-700 p-0'
                }
              >
                makes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive ? 'text-blue-700 p-0' : 'hover:text-blue-700 p-0'
                }
              >
                vin search
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
