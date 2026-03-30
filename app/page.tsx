"use client"
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

type Period = {
  years: number
  monthly: number
}

export default function Page() {
  const [initial, setInitial] = useState(10000)
  const [periods, setPeriods] = useState<Period[]>([
    { years: 5, monthly: 200 },
    { years: 5, monthly: 300 },
    { years: 10, monthly: 400 },
  ])

  const [chartData, setChartData] = useState<any>(null)

  const simulate = (rate: number) => {
    let r = rate / 100 / 12
    let value = initial
    let invested = initial
    let yearly: any[] = []

    periods.forEach((p) => {
      let months = p.years * 12

      for (let i = 0; i < months; i++) {
        value = (value + p.monthly) * (1 + r)
        invested += p.monthly

        if (i % 12 === 0) {
          yearly.push({
            value,
            invested,
            profit: value - invested,
          })
        }
      }
    })

    return yearly
  }

  const run = () => {
    const data5 = simulate(5)
    const data8 = simulate(8)
    const data10 = simulate(10)

    const labels = data8.map((_: any, i: number) => i + 1)

    setChartData({
      labels,
      datasets: [
        {
          label: "5%",
          data: data5.map((d) => d.value),
          borderWidth: 2,
        },
        {
          label: "8%",
          data: data8.map((d) => d.value),
          borderWidth: 2,
        },
        {
          label: "10%",
          data: data10.map((d) => d.value),
          borderWidth: 2,
        },
      ],
      meta: [data5, data8, data10],
    })
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">📈 Invest App</h1>

      <Card className="p-4 space-y-3">
        <Input
          type="number"
          value={initial}
          onChange={(e) => setInitial(Number(e.target.value))}
          placeholder="Začetni vložek"
        />

        {periods.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Input
              type="number"
              value={p.years}
              onChange={(e) => {
                const copy = [...periods]
                copy[i].years = Number(e.target.value)
                setPeriods(copy)
              }}
            />
            <Input
              type="number"
              value={p.monthly}
              onChange={(e) => {
                const copy = [...periods]
                copy[i].monthly = Number(e.target.value)
                setPeriods(copy)
              }}
            />
          </div>
        ))}

        <Button onClick={() => setPeriods([...periods, { years: 5, monthly: 200 }])}>
          ➕ Dodaj obdobje
        </Button>

        <Button onClick={run}>Izračunaj</Button>
      </Card>

      {chartData && (
        <Card className="p-4">
          <Line
            data={chartData}
            options={{
              interaction: {
                mode: "nearest",
                intersect: true,
              },
              plugins: {
                tooltip: {
                  mode: "nearest",
                  intersect: true,
                  callbacks: {
                    label: (context) => {
                      const datasetIndex = context.datasetIndex
                      const index = context.dataIndex

                      const d = chartData.meta[datasetIndex][index]

                      return [
                        context.dataset.label + ": " + d.value.toFixed(0) + " €",
                        "Vloženo: " + d.invested.toFixed(0) + " €",
                        "Dobiček: " + d.profit.toFixed(0) + " €",
                      ]
                    },
                  },
                },
              },
            }}
          />
        </Card>
      )}
    </div>
  )
}
