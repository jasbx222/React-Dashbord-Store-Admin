import { TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../../ui/card"

import useGetData from "../../../hooks/useGetData"

type Status = {
  pending: number
  accepted: number
  completed: number
  returned: number
  cancelled: number
}

type OrdersData = {
  counts: Status
  total: number
}

export function ChartLineOrders() {
  const { data: Data } = useGetData<OrdersData>("get_status_sum")
  const apiData = Data?.counts

  const statusColors: Record<keyof Status, string> = {
    pending: "#6366F1",
    accepted: "#818CF8",
    completed: "#A5B4FC",
    returned: "#C7D2FE",
    cancelled: "#E0E7FF",
  }

  const chartData = [
    { name: "الطلبات", ...apiData },
  ]

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    accepted: "المقبولة",
    completed: "المكتملة",
    returned: "المسترجعة",
    cancelled: "الملغاة",
  }

  return (
    <Card className="flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md rounded-lg p-4 sm:p-6">
      <CardHeader className="items-start sm:items-center pb-2 sm:pb-0 flex-col sm:flex-row justify-between gap-2">
        <div>
          <CardTitle className="text-lg sm:text-xl font-semibold">
            إحصائيات الطلبات
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            تطور الحالات حسب البيانات
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex justify-center items-center py-4 sm:py-6 w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                statusLabels[name] || name,
              ]}
            />
            <Legend formatter={(value) => statusLabels[value] || value} />
            {Object.keys(statusColors).map((status) => (
              <Line
                key={status}
                type="monotone"
                dataKey={status}
                stroke={statusColors[status as keyof Status]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          المجموع الكلي: {Data?.total || 0} طلب{" "}
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          تحديث تلقائي حسب البيانات الحالية
        </div>
      </CardFooter>
    </Card>
  )
}
