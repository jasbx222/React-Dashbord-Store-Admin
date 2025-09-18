import {
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

// ------------------ فورم إضافة  الكوبونات ------------------

type CouponForm = {
  id?: number;
  code: string;
  type: string;
  minimum_order_amount: string;
  value: string;
  expires_at: string;
};

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  newCoupon: CouponForm;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const ModalAddCoupons = ({
  open,
  setOpen,
  handleSubmit,
  newCoupon,
  handleChange,
}: Props) => {
  const smoothBlue = "#7A91FF";

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
          p: 5,
          minWidth: 350,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          color={smoothBlue}
          mb={3}
          textAlign="center"
        >
          {newCoupon.id ? "تعديل الكوبون" : "إضافة كوبون جديد"}
        </Typography>

        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <TextField
            label="كود الكوبون"
            name="code"
            value={newCoupon.code}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              "& .MuiInputLabel-root": { color: smoothBlue },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "& fieldset": { borderColor: smoothBlue + "33" },
                "&:hover fieldset": { borderColor: smoothBlue + "66" },
                "&.Mui-focused fieldset": { borderColor: smoothBlue },
              },
            }}
          />

          <TextField
            select
            label="نوع الكوبون"
            name="type"
            value={newCoupon.type}
            onChange={handleChange}
            fullWidth
            required
            SelectProps={{
              native: true,
            }}
            sx={{
              "& .MuiInputLabel-root": { color: smoothBlue },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "& fieldset": { borderColor: smoothBlue + "33" },
                "&:hover fieldset": { borderColor: smoothBlue + "66" },
                "&.Mui-focused fieldset": { borderColor: smoothBlue },
              },
            }}
          >
            <option value="">اختر النوع</option>
            <option value="fixed">قيمة ثابتة</option>
            <option value="percentage">نسبة مئوية</option>
          </TextField>

          <TextField
            label="الخصم"
            name="value"
            value={newCoupon.value}
            onChange={handleChange}
            fullWidth
            required
            sx={{ "& .MuiInputLabel-root": { color: smoothBlue } }}
          />
          <TextField
            label="الحد الادنى للاستخدام"
            name="minimum_order_amount"
            type="number"
            value={newCoupon.minimum_order_amount}
            onChange={handleChange}
            fullWidth
            required
            sx={{ "& .MuiInputLabel-root": { color: smoothBlue } }}
          />
          <TextField
            label="تاريخ الانتهاء"
            name="expires_at"
            type="date"
            value={newCoupon.expires_at}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiInputLabel-root": { color: smoothBlue } }}
          />
          <Button
            type="submit"
            sx={{
              bgcolor: smoothBlue,
              color: "#fff",
              "&:hover": { bgcolor: smoothBlue + "CC", color: "#fff" },
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 5px 20px rgba(122,145,255,0.3)",
            }}
          >
            {newCoupon.id ? "حفظ التعديلات" : "حفظ الكوبون"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};


// ------------------ جدول الكوبونات ------------------

interface Coupon {
  id: number;
  code: string;
  value: string;
  type: string;
  expires_at: string;
}

type PropsTable = {
  handleDelete: (id: number) => void;
  coupons: Coupon[];
  loading?: boolean;
  handleEdit: (id: number) => void;
};

export const CouponsTable = ({
  coupons,
  handleDelete,
  loading,
  handleEdit,
}: PropsTable) => {
  const smoothBlue = "#7A91FF";

  return (
    <Box className="overflow-x-auto rounded-3xl shadow-lg bg-white">
      {loading ? (
       <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-[#7A91FF]/20 text-gray-900">
            <tr>
              <th className="px-4 py-3 text-right font-semibold">الكود</th>
              <th className="px-4 py-3 text-right font-semibold">الخصم</th>
              <th className="px-4 py-3 text-right font-semibold">النوع</th>
              <th className="px-4 py-3 text-center font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#7A91FF]/30">
            {coupons.map((c) => (
              <tr
                key={c.id}
                className="bg-white hover:bg-[#7A91FF]/10 transition-colors duration-300"
              >
                <td className="px-4 py-3 font-medium text-[#1332D1]">
                  {c.code}
                </td>
                <td className="px-4 py-3 font-semibold text-[#1332D1]">
                  {c.value}
                  {c.type === "fixed" ? "" : "%"}
                </td>
                <td className="px-4 py-3 text-[#1332D1]">
                  {c.type === "fixed" ? "ثابت" : "نسبة مئوية"}
                </td>
                <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <IconButton
                    sx={{
                      bgcolor: smoothBlue + "20",
                      color: smoothBlue,
                      "&:hover": { bgcolor: smoothBlue + "30" },
                      p: 0.5,
                    }}
                    onClick={() => handleEdit(c.id)} // استدعاء دالة handleEdit عند الضغط على التعديل
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: smoothBlue + "10",
                      color: smoothBlue,
                      "&:hover": { bgcolor: smoothBlue + "20" },
                      p: 0.5,
                    }}
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
};

