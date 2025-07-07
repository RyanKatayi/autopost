'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname === path
  }

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    router.push(href)
  }

  const navItems = [
    {
      href: '/dashboard',
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      href: '/dashboard/create',
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'Create Post'
    },
    {
      href: '/dashboard/posts',
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Posts'
    },
    {
      href: '/dashboard/account',
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Account'
    }
  ]

  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">AutoPost AI</h1>
        </div>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item, index) => (
          <div key={item.href} className={`px-3 ${index === 0 ? '' : 'mt-2'}`}>
            <Link 
              href={item.href}
              onClick={(e) => handleNavigation(e, item.href)}
              className={`group flex items-center px-3 py-2 text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-lime-50 border-r-2 border-lime-400 text-lime-700 rounded-l-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
              }`}
            >
              <span className={isActive(item.href) ? 'text-lime-500' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}