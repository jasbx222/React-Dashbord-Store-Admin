import { useState, type ChangeEvent, type FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  CouponsTable,
  ModalAddCoupons,
} from "../../components/pages/coupon/Coupons";
import { toast } from "react-toastify";
import usePost from "../../hooks/usePost";
import useGetData from "../../hooks/useGetData";
import useDelete from "../../hooks/useDelete";
import useUpdate from "../../hooks/useUpdate";
import type { Coupon } from "../../types/types";



export const smoothBlue = "#7A91FF";

const Coupons = () => {
  const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");
  const { data: coupons, loading, refetch } = useGetData<Coupon>("coupons");
  const [newCoupon, setNewCoupon] = useState({
    id: 0,
    code: "",
    type: "",
    minimum_order_amount: "",
    value: "",
    expires_at: "",
  });
  const { update } = useUpdate();
  const { add } = usePost();
  const { remove } = useDelete();

  const handleEdit = (id: number) => {
    const couponToEdit = coupons?.data.find(coupon => coupon.id === id);
    if (couponToEdit) {
      setNewCoupon({
        id: couponToEdit.id,  // إضافة id هنا لتحديث الكوبون بشكل صحيح
        code: couponToEdit.code,
        type: couponToEdit.type,
        minimum_order_amount: couponToEdit.minimum_order_amount,
        value: couponToEdit.value,
        expires_at: couponToEdit.expires_at,
      });
      setOpen(true);
    }
  };
  const filteredCoupons = Array.isArray(coupons?.data)
    ? coupons.data.filter((cp: any) =>
        cp.code.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newCoupon?.id) {
      // تحديث الكوبون
      update(`coupons/${newCoupon.id}`, newCoupon)
        .then(() => {
          toast.success("✅ تم تحديث الكوبون بنجاح");
          refetch();
          setOpen(false);
          setNewCoupon({ id: 0, code: "", type: "", minimum_order_amount: "", value: "", expires_at: "" });  // إعادة تعيين الحقول
        })
        .catch(() => toast.error("❌ فشل تحديث الكوبون"));
    } else {
      // إضافة كوبون جديد
      add("coupons", { ...newCoupon })
        .then(() => {
          toast.success("✅ تم إضافة الكوبون بنجاح");
          refetch();
          setOpen(false);
          setNewCoupon({ id: 0, code: "", type: "", minimum_order_amount: "", value: "", expires_at: "" });  // إعادة تعيين الحقول
        })
        .catch(() => toast.error("❌ فشل إضافة الكوبون"));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الكوبون؟")) {
      try {
        await remove(`coupons/${id}`);
        refetch();
        toast.success("✅ تم حذف الكوبون بنجاح");
      } catch (error) {
        toast.error("❌ فشل حذف الكوبون");
      }
    }
  };

  return (
    <Box className="p-6 min-h-screen bg-[rgba(122,145,255,0.05)]">
      <Box className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Typography variant="h4" fontWeight={600} color={smoothBlue}>
          كوبونات الخصم
        </Typography>
        
        <Button
          onClick={() => setOpen(true)}
       
          sx={{
            bgcolor: smoothBlue,
            color: "#fff",
            "&:hover": { bgcolor: smoothBlue + "CC", color: "#fff" },
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 5px 20px rgba(122,145,255,0.3)",
            textTransform: "none",
          }}
        >
          إضافة كوبون
        </Button>
         
      </Box>
 <TextField
        label="ابحث عن كوبون..."
        variant="outlined"
        size="small"
        
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <CouponsTable
        handleEdit={handleEdit}
        coupons={filteredCoupons ?? []}
        loading={loading}
        handleDelete={handleDelete}
      />

      <ModalAddCoupons
        newCoupon={newCoupon}
        open={open}
        setOpen={setOpen}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Coupons;
