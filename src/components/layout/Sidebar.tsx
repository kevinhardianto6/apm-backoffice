import { NavLink } from 'react-router-dom'
import { navGroups } from './navConfig'

export function Sidebar({ appId }: { appId: string }) {
  return (
    <nav className="flex flex-col gap-6 px-4 py-6 text-sm">
      {navGroups.map((group) => (
        <div key={group.heading}>
          <div className="mb-2 px-2 text-xs tracking-wider text-slate-500">{group.heading}</div>
          <div className="flex flex-col gap-1">
            {group.items.map((item) =>
              item.path ? (
                <NavLink
                  key={item.label}
                  to={item.path(appId)}
                  end
                  className={({ isActive }) =>
                    `rounded px-2 py-1.5 ${
                      isActive
                        ? 'bg-indigo-900/60 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <span
                  key={item.label}
                  title="Not available yet"
                  className="cursor-not-allowed rounded px-2 py-1.5 text-slate-600"
                >
                  {item.label}
                </span>
              ),
            )}
          </div>
        </div>
      ))}
    </nav>
  )
}
