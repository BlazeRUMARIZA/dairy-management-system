import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div 
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow'
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs yesterday
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
