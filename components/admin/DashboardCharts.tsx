'use client'

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, Ticket, Users, PartyPopper } from 'lucide-react'

interface ChartData {
  date: string
  revenue?: number
  tickets?: number
  users?: number
  parties?: number
}

interface DashboardChartsProps {
  revenueData: ChartData[]
  ticketsData: ChartData[]
  usersData: ChartData[]
  partiesData: ChartData[]
}

export default function DashboardCharts({ revenueData, ticketsData, usersData, partiesData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue Chart */}
      <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          Revenue (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis 
              dataKey="date" 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <YAxis 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [`$${value}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tickets Sold Chart */}
      <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-blue-400" />
          Tickets Sold (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ticketsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis 
              dataKey="date" 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <YAxis 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [value, 'Tickets']}
            />
            <Bar 
              dataKey="tickets" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth Chart */}
      <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          User Growth (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={usersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis 
              dataKey="date" 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <YAxis 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [value, 'New Users']}
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#a855f7" 
              strokeWidth={2}
              dot={{ fill: '#a855f7', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Parties Created Chart */}
      <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg p-4">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <PartyPopper className="w-4 h-4 text-pink-400" />
          Parties Created (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={partiesData}>
            <defs>
              <linearGradient id="colorParties" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
            <XAxis 
              dataKey="date" 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <YAxis 
              stroke="#707070"
              fontSize={10}
              tick={{ fill: '#707070' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #252525',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any) => [value, 'Parties']}
            />
            <Area 
              type="monotone" 
              dataKey="parties" 
              stroke="#ec4899" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorParties)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}














