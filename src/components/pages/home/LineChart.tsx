import { GitCommitVertical, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../../ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./../../ui/chart"

export const description = "A line chart with custom dots"

const chartData = [
  { month: "يناير", desktop: 10 },
  { month: "فبراير", desktop: 7 },
  { month: "مارس", desktop: 9 },
  { month: "أبريل", desktop: 6 },
  { month: "مايو", desktop: 12 },
  { month: "يونيو", desktop: 17 },
]

const chartConfig = {
  desktop: {
    label: "الوصول",
    color: "#6366F1",
  },
} satisfies ChartConfig

export function ChartLineDotsCustom() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>هذا الشهر</CardTitle>
        <CardDescription>الوصول خلال آخر 6 أشهر</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="#6366F1"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 18
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="#6366F1"
                    stroke="#6366F1"
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-green-600">
          ↑ نمو بنسبة 0.00% هذا الشهر <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          إحصائيات آخر 6 أشهر
        </div>
      </CardFooter>
    </Card>
  )
}
