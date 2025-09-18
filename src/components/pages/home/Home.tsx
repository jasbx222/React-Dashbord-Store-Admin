

import { Card, CardContent } from "../../ui/card";
import { TopClientsTable } from "./TableChart";
import { ChartLineOrders } from "./ChartLineOrders";

import { ChartArea, Headset, Box, User2, Layers } from "lucide-react";
import useGetData from "../../../hooks/useGetData";

type DashboardCounts = {
  orders: number;
  products: number;
  categories: number;
  clients: number;
  ads:number
};

export default function Dashboard() {
  const { data } = useGetData<DashboardCounts>("dashboard-counts");

  const topCards = [
    {
      id: 1,
      title: "إجمالي الطلبات",
      value: data?.orders ?? 0,
      icon: <ChartArea className="w-6 h-6 text-purple-600" />,
    },
    {
      id: 2,
      title: "المنتجات",
      value: data?.products ?? 0,
      icon: <Box className="w-6 h-6 text-purple-600" />,
    },
    {
      id: 3,
      title: "العملاء",
      value: data?.clients ?? 0,
      icon: <User2 className="w-6 h-6 text-purple-600" />,
    },
    {
      id: 4,
      title: "الفئات",
      value: data?.categories ?? 0,
      icon: <Layers className="w-6 h-6 text-purple-600" />,
    },{
      id:5,
            title: "الاعلانات",
      value: data?.ads ?? 0,
      icon: <Headset className="w-6 h-6 text-purple-600" />,
    }
  ];

  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-screen p-6"
      dir="rtl"
    >
      <div className="flex flex-col gap-8">
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols- xl:grid-cols-5 gap-6">
          {topCards.map((card) => (
            <Card
              key={card.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <CardContent className="flex flex-col items-center gap-2">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className="text-xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopClientsTable />
          <Card className="p-6 rounded-2xl shadow-lg bg-white">
            <div className="mt-6 w-full">
              <ChartLineOrders />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
