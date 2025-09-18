import { useState, useEffect, type ChangeEvent } from "react";
import useUpdate from "../../../hooks/useUpdate";
import useGetData from "../../../hooks/useGetData"; 
import { useParams } from "react-router-dom";
import type { ProductFormData } from "../../../types/types";

export default function FormUpdate  (){
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    price_after: "",
    is_offer: false,
    offer_name: "",
    image: null as File | null,
  });

  const { data } = useGetData<ProductFormData>(`products/${id}`); 
  const { update } = useUpdate();

  useEffect(() => {
    if (data) {
      setProduct({
        name: data.name || "",
        description: data.description || "",
        quantity: data.quantity || 0,
        price: data.price || 0,
        price_after: data.price_after?.toString() || "",
        is_offer: !!data.is_offer,
        offer_name: data.offer_name || "",
        image: null, // الصورة ما تتحمل مباشرة
      });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity.toString());
    formData.append("price", product.price.toString());
    formData.append("price_after", product.price_after?.toString() || "0");
    formData.append("is_offer", product.is_offer ? "1" : "0");
    formData.append("offer_name", product.offer_name || "");
    if (product.image) {
      formData.append("image", product.image);
    }
    update(`products/${id}`, formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 text-[#4329fc] bg-white"
      encType="multipart/form-data"
    >
      <h2 className="text-lg font-bold text-center mb-4">تعديل المنتج</h2>

      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="اسم المنتج"
        className="border rounded p-2 w-full"
        required
      />

      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="وصف المنتج"
        className="border rounded p-2 w-full"
        rows={3}
        required
      />

      <input
        type="number"
        name="quantity"
        value={product.quantity|| ""}
        onChange={handleChange}
        placeholder="الكمية"
        className="border rounded p-2 w-full"
        min={0}
        required
      />

      <input
        type="number"
        name="price"
        value={product.price || ""}
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
        value={product.price_after|| ""}
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
          checked={product.is_offer}
          onChange={handleChange}
          id="is_offer"
        />
        <label htmlFor="is_offer">يوجد عرض؟</label>
      </div>

      <input
        name="offer_name"
        value={product.offer_name}
        onChange={handleChange}
        placeholder="اسم العرض (اختياري)"
        className="border rounded p-2 w-full"
      />

      <input
        type="file"
        name="image"
        onChange={handleFileChange}
        accept="image/*"
      />

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-[#4329fc] text-white px-4 py-2 rounded-lg hover:bg-[#2f1ccc] transition disabled:opacity-50"
        >
          حفظ
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};


