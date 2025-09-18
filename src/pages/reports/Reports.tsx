import { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Button } from "../../components/ui/button";
import * as XLSX from "xlsx";
import useGetData from "../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type {
  Coupon,
  ProductsResponse,
  ReportsCustomersResponse,
  TopSellingProductsResponse,
} from "../../types/types";

export default function Reports() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const { data: products } = useGetData<ProductsResponse>("reports_products");
  const { data: customers } = useGetData<ReportsCustomersResponse>("reports_customers");
  const { data: coupons } = useGetData<Coupon>("reports_coupons");
  const { data: topProducts } = useGetData<TopSellingProductsResponse>("top-selling-products");

  const exportExcel = (rows: any[] | undefined, fileName: string) => {
    if (!rows || rows.length === 0) {
      toast.warning("لا توجد بيانات للتصدير 🚫");
      return;
    }
    try {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      toast.success("تم تصدير التقرير بنجاح ✅");
    } catch {
      toast.error("حدث خطأ أثناء التصدير ❌");
    }
  };

  return (
    <div className="p-6">
      <Tabs
        value={tabIndex}
        onChange={(_, v) => setTabIndex(v)}
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        <Tab label="المنتجات النافذة" />
        <Tab label="العملاء الأكثر شراء" />
        <Tab label="الكوبونات المنتهية" />
        <Tab label="المنتجات الأكثر مبيعاً" />
      </Tabs>

      {/* زر التصدير */}
      <Box className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          onClick={() => {
            switch (tabIndex) {
              case 0:
                exportExcel(products?.products?.data, "out_of_stock_products");
                break;
              case 1:
                exportExcel(customers?.data, "top_customers");
                break;
              case 2:
                exportExcel(Array.isArray(coupons?.data) ? coupons.data : [], "expired_coupons");
                break;
              case 3:
                exportExcel(topProducts?.data, "top_selling_products");
                break;
            }
          }}
        >
          تصدير Excel
        </Button>
      </Box>

      <Box className="mt-6">
        {/* المنتجات النافذة */}
        {tabIndex === 0 && (
          <>
            {products?.products?.data?.length ? (
              <table className="w-full border-collapse border">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border p-2 text-start">اسم المنتج</th>
                    <th className="border p-2 text-start">الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {products.products.data.map((p) => (
                    <tr key={p.id}>
                      <td className="border p-2 text-start">{p.name}</td>
                      <td className="border p-2 text-red-600 text-start">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-gray-400">لا توجد منتجات</Typography>
            )}
          </>
        )}

        {/* العملاء الأكثر شراء */}
        {tabIndex === 1 && (
          <>
            {customers?.data?.length ? (
              <table className="w-full border-collapse border">
                <thead className="bg-green-100">
                  <tr>
                    <th className="border p-2 text-start">اسم العميل</th>
                    <th className="border p-2 text-start">الايميل</th>
                    <th className="border p-2 text-start">الهاتف</th>
                    <th className="border p-2 text-start">عدد الطلبات</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.data.map((c) => (
                    <tr key={c.id}>
                      <td className="border p-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => navigate(`/clients/${c.id}`)}
                        >
                          {c.name}
                        </button>
                      </td>
                      <td className="border p-2">{c.email}</td>
                      <td className="border p-2">{c.phone}</td>
                      <td className="border p-2 text-green-600">{c.orders_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-gray-400">لا يوجد عملاء</Typography>
            )}
          </>
        )}

        {/* الكوبونات المنتهية */}
        {tabIndex === 2 && (
          <>
            {Array.isArray(coupons?.data) && coupons.data.length > 0 ? (
              <table className="w-full border-collapse border">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border p-2 text-start">كود الكوبون</th>
                    <th className="border p-2 text-start">تاريخ الانتهاء</th>
                    <th className="border p-2 text-start">المستخدمون</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.data.map((cp: any) => (
                    <tr key={cp.id}>
                      <td className="border p-2">{cp.code}</td>
                      <td className="border p-2">{cp.expires_at?.slice(0, 10)}</td>
                      <td className="border p-2">
                        {cp.uses?.length ? (
                          cp.uses.map((use: any) => (
                            <button
                              key={use.id}
                              className="px-2 py-1 bg-blue-600 text-white rounded mr-2 mb-1 hover:bg-blue-700 transition"
                              onClick={() => navigate(`/client/${use.client_id}`)}
                            >
                              {use.client_name || `عميل #${use.client_id}`}
                            </button>
                          ))
                        ) : (
                          <span className="text-gray-500">لا يوجد مستخدمون</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-gray-400">لا توجد كوبونات</Typography>
            )}
          </>
        )}

        {/* المنتجات الأكثر مبيعاً */}
        {tabIndex === 3 && (
          <>
            {topProducts?.data?.length ? (
              <table className="w-full border-collapse border">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="border p-2 text-start">اسم المنتج</th>
                    <th className="border p-2 text-start">الكمية المباعة</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.data.map((p) => (
                    <tr key={p.id}>
                      <td className="border p-2">{p.name}</td>
                      <td className="border p-2 text-yellow-700">{p.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography className="text-gray-400">لا توجد منتجات مباعة</Typography>
            )}
          </>
        )}
      </Box>
    </div>
  );
}
