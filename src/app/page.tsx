'use client'

import { Monthly, fixed } from '@/lib/util'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { ReferenceLine, Bar, ComposedChart, Legend, Area, Tooltip, Line, CartesianGrid, LineChart, XAxis, YAxis } from 'recharts'

function renderYearTick (tickProps: any) {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;

  if (value % 12 === 0) {
    return <text x={x} y={y + 1} textAnchor="middle">{`Y${value / 12}`}</text>;
  }

  if (value % 12 === 1) {
    const pathX = Math.floor(x + offset) - 6;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }

  return null;
}

export default function Home() {
  let rate = 0.05
  let amortization = 30
  let principal = 500_000

  let data: Monthly[] = useMemo(() => {
    return fixed({
      rate,
      amortization,
      principal
    })
  }, [rate, amortization, principal])

  let monthChartData = useMemo(() => {
    let month = []
    for (let i = 0; i < data.length; i++) {
      let d = data[i]

      month.push({
        payment: i,
        year: Math.floor(i / 12),
        interest: d.interest,
        principal: d.principal
      })
    }

    return month
  }, [data])

  let yearlyChart = useMemo(() => {
    let totalInterest = 0
    let totalPrincipal = 0

    let yearInterest = 0
    let yearPrincipal = 0
    let totalCost = 0
    let remainingPrincipal = principal

    let year = []
    let i
    for (i = 0; i < data.length; i++) {
      let d = data[i]

      if (i % 12 === 0) {
        year.push({
          year: Math.floor(i / 12),
          totalCost,
          totalInterest, 
          totalPrincipal,
          yearInterest,
          yearPrincipal,
          remainingPrincipal
        })

        yearInterest = 0
        yearPrincipal = 0
      }

      totalInterest += d.interest
      totalPrincipal += d.principal
      yearInterest += d.interest
      yearPrincipal += d.principal
      totalCost += (d.interest + d.principal)
      remainingPrincipal -= d.principal
    }

    year.push({
      year: Math.floor(i / 12),
      totalCost,
      totalInterest, 
      totalPrincipal,
      yearInterest,
      yearPrincipal,
      remainingPrincipal
    })

    return year
  }, [data, principal])

  let monthlyPayment = useMemo(() => {
    return data[0].interest + data[0].principal
  }, [data])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ComposedChart width={720} height={250} data={monthChartData}>
        <XAxis dataKey="payment" />
        <XAxis xAxisId="1" dataKey="year" allowDuplicatedCategory={false} />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Area dataKey="interest" stackId="a" fill='red'/>
        <Area dataKey="principal" stackId="a" fill='green' />
        <YAxis />
        <Legend />
        <ReferenceLine y={monthlyPayment} label={`Monthly payment ${Math.round(monthlyPayment)}`} stroke="red" strokeDasharray="3 3" />
      </ComposedChart>

      <ComposedChart width={720} height={250} data={yearlyChart}>
        <XAxis dataKey="year" />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="yearInterest" stackId="a" fill='red'/>
        <Bar dataKey="yearPrincipal" stackId="a" fill='green' />
        <YAxis />
        <Legend />
      </ComposedChart>

      <ComposedChart width={720} height={250} data={yearlyChart}>
        <XAxis dataKey="year" />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Area dataKey="remainingPrincipal" fill='blue' />
        <Line dataKey="totalCost" stroke='orange' />
        <Line dataKey="totalInterest" stroke='red' />
        <Line dataKey="totalPrincipal" stroke='green' />
        <YAxis />
        <Legend />
      </ComposedChart>
    </main>
  )
}
