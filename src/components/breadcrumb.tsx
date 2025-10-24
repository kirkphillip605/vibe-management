import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-2 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  isLast
                    ? 'font-medium text-zinc-950 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400'
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
