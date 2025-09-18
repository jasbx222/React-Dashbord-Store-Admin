
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./../../ui/card"

import useGetData from "../../../hooks/useGetData"

type Client = {
  id: number
  name: string
  orders_count: number
}

type TopClientsData = {
  top_clients: Client[]
}

export function TopClientsTable() {
  const { data } = useGetData<TopClientsData>("top_clients")
  const clients = data?.top_clients || []

  return (
    <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle>أكثر العملاء شراءً</CardTitle>
        <CardDescription>عدد الطلبات لكل عميل</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2">العميل</th>
              <th className="px-4 py-2">عدد الطلبات</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr
                key={client.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2 font-medium">{client.name}</td>
                <td className="px-4 py-2 text-purple-600 font-semibold">{client.orders_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
