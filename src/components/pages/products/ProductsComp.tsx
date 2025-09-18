import { ChevronDown } from "lucide-react";
import type { Product } from "../../../types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { type ChangeEvent, type FormEvent } from "react";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import useDelete from "../../../hooks/useDelete";
import { toast } from "react-toastify";
import Loading from "../../ui/Loading";

interface TableProductsProps {
  products: Product[];
  pagination?: {
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
  onView?: (product: Product) => void;
 
  refetch?: () => void;

}



export const TableProducts: React.FC<TableProductsProps> = ({
  products,
  pagination,
  onPageChange,
  loading,
  refetch,

}) => {

  const{remove}=useDelete()

  const onDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await remove(`products/${id}`)
        toast.success("تم حذف المنتج بنجاح");
        refetch?.(); // إعادة جلب البيانات بعد الحذف
      }catch (error) {
        console.error("خطأ في حذف المنتج:", error);
        alert("حدث خطأ أثناء حذف المنتج. حاول مرة أخرى.");
      }
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
   {
    loading ? <Loading /> :
       <table className="min-w-full rounded-2xl overflow-hidden">
        <thead className="bg-[#4329fc]/10 text-[#4329fc]">
          <tr>
            {[
              "المنتج",
              "التصنيف",
              "السعر",
              "السعر بعد الخصم",
              "المخزون",
              "تاريخ الإضافة",
              "الإجراءات",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-center text-sm font-semibold tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products?.length ? (
            products?.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[#4329fc]/5 transition-colors duration-300"
              >
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  {product.category?.name || "بدون تصنيف"}
                  </td>{" "}

                <td className="px-6 py-4   line-through font-semibold text-[#4329fc]">
                  {product.price} د.ع
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  {product.price_after || "-"} د.ع
                </td>
                <td className="px-6 py-4">{product.quantity}</td>
 {new Date(product.created_at).toLocaleDateString("ar-EG")}
                <td className="px-6 py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-3 py-2 bg-[#4329fc]/10 text-[#4329fc] rounded-lg hover:bg-[#4329fc]/20 transition-all shadow-sm">
                      <ChevronDown size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl shadow-xl bg-white"
                    >
                      <DropdownMenuLabel>اختر إجراء</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-[#4329fc] hover:bg-[#4329fc]/10"
                      
                      >
                     <Link
                        to={`/products/${product.id}`}
                        className="w-full h-full"
                      >
                        عرض
                      </Link>

                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-green-600 hover:bg-green-50"
                      
                      >
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="w-full h-full"
                      >
                        
                        تعديل
                      </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => onDelete?.(product.id)} // حذف المنتج
                      >
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6">
                لا توجد منتجات
              </td>
            </tr>
          )}
        </tbody>
      </table>
   }

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-1 rounded-lg ${
                  page === pagination.current_page
                    ? "bg-[#7A91FF] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

type Category = {
  id: number;
  name: string;
   parent:{
    id:number;
    name:string
  }
};

type ProductFormProps = {
  categories: Category[];
  newProduct: {
    name: string;
    description: string;
    category_id: number;
    quantity: number;
    price: number;
    price_after?: number;
    is_offer: boolean;
    offer_name?: string;
    image: File | null;
  };
  setNewProduct: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

const ProductModalForm = ({
  categories,
  newProduct,
  setNewProduct,
  onSubmit,
  onClose,
}: ProductFormProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setNewProduct((prev: any) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === "number") {
      setNewProduct((prev: any) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setNewProduct((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <form
        onSubmit={onSubmit}
        className="p-6 space-y-4 text-[#4329fc] bg-white"
        encType="multipart/form-data" // مهم عند رفع ملفات
      >
        <h2 className="text-lg font-bold text-center mb-4">إضافة منتج جديد</h2>

        <input
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="اسم المنتج"
          className="border rounded p-2 w-full"
          required
        />

        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="وصف المنتج"
          className="border rounded p-2 w-full"
          rows={3}
          required
        />

     <select
  name="category_id"
  value={newProduct.category_id || ""}
  onChange={handleChange}
  className="border rounded p-2 w-full"
  required
>
  <option value="" disabled>
    اختر القسم الفرعي
  </option>
  {categories
    ?.filter((cat) => cat.parent.id) 
    .map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
</select>


        <input
          type="number"
          name="quantity"
          value={newProduct.quantity ||""}
          onChange={handleChange}
          placeholder="الكمية"
          className="border rounded p-2 w-full"
          min={0}
          required
        />

        <input
          type="number"
          name="price"
          value={newProduct.price ||""}
          onChange={handleChange}
          placeholder="السعر"
          className="border rounded p-2 w-full"
          min={0}
          step="0.01"
          required
        />

        <input
          type="number"
          name="price_after"
          value={newProduct.price_after || ""}
          onChange={handleChange}
          placeholder="السعر بعد الخصم"
          className="border rounded p-2 w-full"
          min={0}
          step="0.01"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_offer"
            checked={newProduct.is_offer}
            onChange={handleChange}
            id="is_offer"
          />
          <label htmlFor="is_offer">يوجد عرض؟</label>
        </div>

        <input
          name="offer_name"
          value={newProduct.offer_name || ""}
          onChange={handleChange}
          placeholder="اسم العرض (اختياري)"
          className="border rounded p-2 w-full"
        />

        {/* رفع الصور */}
        <input
          type="file"
          name="image"
          onChange={(e) =>
            setNewProduct((prev: typeof newProduct) => ({
              ...prev,
              image: e.target.files ? e.target.files[0] : null, // ✅ ملف واحد فقط
            }))
          }
          accept="image/*"
        />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-[#4329fc] text-white px-4 py-2 rounded-lg hover:bg-[#2f1ccc] transition"
          >
            حفظ المنتج
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default ProductModalForm;
