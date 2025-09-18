
import { useParams, Link } from "react-router-dom";
import type { ProductFormData } from "../../types/types";
import { ArrowLeft } from "lucide-react";
import useShow from "../../hooks/useShow";
export default function ProductDetails() {
  const { id } = useParams(); // ياخذ id من الراوتر
const {data:product,loading}=useShow<ProductFormData>(`products/${id}`)


  if (loading) return <div className="p-6 text-center">جاري التحميل...</div>;
  if (!product) return <div className="p-6 text-center">لم يتم العثور على المنتج</div>;

  return (
    <div className="p-6 min-h-screen bg-white/90 text-[#4329fc]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>

        <Link
          to="/products"
          className="flex items-center gap-2 bg-[#4329fc] text-white px-4 py-2 rounded-lg hover:bg-[#2f1ccc] transition"
        >
          <ArrowLeft size={18} />
          رجوع
        </Link>
      </div>

      {/* //image 
      //  */}
        <div className="mb-6 flex justify-center">
   <img
  src={`${product.image}`}
  alt={product.name}
  className="w-48 h-48 object-cover rounded-lg shadow-md"
/>
      </div>


      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
       

        {/* البيانات */}
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
    
          <p>
            <span className="font-semibold">السعر:</span>{" "}
            {product.price} د.ع
          </p>
          {product.is_offer && (
            <p className="text-green-600 font-semibold">
              عرض خاص: {product.offer_name} - {product.price_after} د.ع
            </p>
          )}
          <p>
            <span className="font-semibold">المخزون:</span>{" "}
            {product.quantity}
          </p>
        </div>
      </div>
    </div>
  );
}
