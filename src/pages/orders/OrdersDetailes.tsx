import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import useShow from "../../hooks/useShow";
import { useParams, Link } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { MapPinIcon } from "lucide-react";
import type { OrderDetailsResponse } from "../../types/orders";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: orders, loading } = useShow<OrderDetailsResponse>(`orders/${id}`);
  const order = orders?.data;

  const statusLabel = (status: string): string => {
    switch (status) {
      case "pending": return "معلق";
      case "accepted": return "مقبول";
      case "returned": return "مسترجع";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغى";
      default: return "غير معروف";
    }
  };

  if (loading) return <Loading />;
  if (!order) return <p>لم يتم العثور على الطلب</p>;

  const handleExportExcel = () => {
    if (!order) return;
    const dataForExcel = order.products.map((product) => ({
      "اسم المنتج": product.name,
      "الكمية": product.pivot.quantity,
      "السعر": product.price,
      "السعر بعد الخصم": product.price_after,
      "اسم العرض": product.offer_name || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderProducts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Order_${order.id}_Products.xlsx`);
  };

  const mapsUrl =
    order?.address?.latitude && order?.address?.longitude
      ? `https://www.google.com/maps?q=${order.address.latitude},${order.address.longitude}`
      : null;

  return (
   <div className="flex flex-col gap-6 p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">

  {/* معلومات العميل */}
  <Card className="shadow-md rounded-2xl border border-gray-200">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-gray-700">معلومات العميل</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-gray-600">
      <p>
        <strong>الاسم:</strong>{" "}
        <Link
          to={`/client/${order.client.id}`}
          className="text-indigo-600 hover:underline font-medium"
        >
          {order.client.name}
        </Link>
      </p>
      <p><strong>الهاتف:</strong> {order.client.phone}</p>
      <p><strong>الإيميل:</strong> {order.client.email}</p>
      <p>
        <strong>الحالة:</strong>{" "}
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            order.client.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {order.client.is_active ? "نشط" : "غير نشط"}
        </span>
      </p>
    </CardContent>
  </Card>

  {/* تفاصيل الطلب */}
  <Card className="shadow-md rounded-2xl border border-gray-200">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">تفاصيل الطلب #{order.id}</CardTitle>
      <CardDescription>
        حالة الطلب:{" "}
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === "completed"
              ? "bg-green-100 text-green-700"
              : order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {statusLabel(order.status)}
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 text-gray-700">
      <p><strong>المجموع:</strong> {order.total} د.ع</p>
      <p><strong>سعر التوصيل:</strong> {order.delivery_price} د.ع</p>
      <p><strong>الخصم:</strong> {order.discount} د.ع</p>
      <p className="text-lg font-bold text-indigo-600">
        المجموع النهائي: {order.total_with_delivery_price} د.ع
      </p>
    </CardContent>
  </Card>

  {/* المنتجات */}
  <Card className="shadow-md rounded-2xl border border-gray-200">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">المنتجات</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4">
      {order.products.length ? (
        order.products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-lg text-gray-800">{product.name}</p>
              <p className="text-sm text-gray-600"><strong>الكمية:</strong> {product.pivot.quantity}</p>
              <p className="text-sm text-gray-600"><strong>السعر:</strong> {product.price} د.ع</p>
              <p className="text-sm text-gray-600"><strong>بعد الخصم:</strong> {product.price_after} د.ع</p>
              {product.offer_name && (
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                  عرض: {product.offer_name}
                </span>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 text-center">لا توجد منتجات</p>
      )}
    </CardContent>
  </Card>

  {/* العنوان */}
  <Card className="shadow-md rounded-2xl border border-gray-200">
    <CardHeader className="flex items-center gap-2">
      <MapPinIcon className="w-5 h-5 text-red-500" />
      <CardTitle className="text-lg font-semibold">عنوان التوصيل</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-gray-700">
      {order.address ? (
        <>
          <p><strong>المحافظة:</strong> {order.address.governorate?.name || "-"}</p>
          <p><strong>الاسم:</strong> {order.address.name || "-"}</p>
          <p><strong>خط الطول:</strong> {order.address.longitude || "-"}</p>
          <p><strong>خط العرض:</strong> {order.address.latitude || "-"}</p>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow hover:from-indigo-600 hover:to-indigo-700 transition"
            >
              <MapPinIcon className="w-4 h-4" /> عرض على الخريطة
            </a>
          )}
        </>
      ) : (
        <p className="text-gray-500">لا يوجد عنوان</p>
      )}
    </CardContent>
  </Card>

  {/* زر تصدير */}
  <div className="flex justify-end">
    <button
      onClick={handleExportExcel}
      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow hover:from-green-600 hover:to-green-700 transition"
    >
    تصدير Excel
    </button>
  </div>
</div>

  );
}
