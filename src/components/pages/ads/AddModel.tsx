import React, { useState } from "react";
import CancleOrSave from "../../ui/CancleOrNot";
import GenericModal from "../../ui/GenericModal";
import usePost from "../../../hooks/usePost";
import useUpdate from "../../../hooks/useUpdate";
import useGetData from "../../../hooks/useGetData";
import type { AdItem, ProductAds } from "../../../types/types";



interface Props {
  item?: AdItem; 
  onClose: () => void;
  isOpen: boolean; 
  refetch: () => void;
}

export default function AdModal({ item, onClose, refetch, isOpen }: Props) {
  const [type, setType] = useState("slider");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [productId, setProductId] = useState<number | "">("");

  const { add } = usePost();
  const { update } = useUpdate();

  // جلب المنتجات من الباك
  const { data: productsData } = useGetData< ProductAds >("products");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      alert("الرجاء اختيار منتج!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("product_id", String(productId));
      if (image) formData.append("image", image);

      if (item?.id) {
        await update(`ads/${item.id}`, formData,true);
   
      } else {
        await add("ads", formData, true);
        
      }

      refetch();
      onClose();
    } catch (err) {
      console.error("Error submitting ad:", err);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "تعديل الإعلان" : "إضافة إعلان"}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* نوع الإعلان */}
        <div>
              {/* عنوان الإعلان */}
        <div>
          <label className="block mb-2 font-semibold text-[#4329fc]">عنوان الإعلان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#4329fc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4329fc] focus:border-[#4329fc] transition"
            placeholder="أدخل عنوان الإعلان هنا"
          />
        </div>
          <label className="block mb-2 font-semibold text-[#4329fc]">نوع الإعلان</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-[#4329fc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4329fc] focus:border-[#4329fc] transition"
          >
            <option value="slider">سلايدر</option>
            <option value="banner">بانر</option>
          </select>
        </div>

        {/* اختيار المنتج */}
        <div>
          <label className="block mb-2 font-semibold text-[#4329fc]">اختر المنتج</label>
         <select
  value={productId}
  onChange={(e) => setProductId(Number(e.target.value))}
  className="w-full border border-[#4329fc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4329fc] focus:border-[#4329fc] transition"
>
  <option value="">-- اختر منتج --</option>
  {productsData?.products?.data.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

        </div>

        {/* رفع الصورة */}
        <div>
          <label className="block mb-2 font-semibold text-[#4329fc]">الصورة</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-[#4329fc]
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-[#4329fc]/10 file:text-[#4329fc]
              hover:file:bg-[#4329fc]/20
              focus:outline-none focus:ring-2 focus:ring-[#4329fc] focus:border-[#4329fc]
              transition"
          />
          {item?.image && !image && (
            <img
              src={item.image}
              alt="Ad"
              className="mt-2 w-32 h-20 object-cover rounded-lg border"
            />
          )}
        </div>

    

        <CancleOrSave onClose={onClose} />
      </form>
    </GenericModal>
  );
}
