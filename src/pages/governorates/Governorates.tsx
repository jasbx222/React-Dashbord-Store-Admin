import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import useGetData from "../../hooks/useGetData";
import useUpdate from "../../hooks/useUpdate";
import { toast } from "react-toastify";

const smoothBlue = "#7A91FF";

type GovernorateData = {
  id: number;
  name: string;
  delivery_price: string;
};

interface Governorate {
  data: GovernorateData[];
}

const GovernoratesPage = () => {
  const { data: governorates, loading, refetch } =
    useGetData<Governorate>("governorates");
  const { update } = useUpdate();

  // نخزن التغييرات المؤقتة للسعر
  const [prices, setPrices] = useState<Record<number, string>>({});

  const handleChange = (id: number, value: string) => {
    setPrices((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: number) => {
    try {
      const newPrice = prices[id];
      if (!newPrice) {
        toast.warning("الرجاء إدخال سعر التوصيل");
        return;
      }
      await update(`governorates/${id}`, { delivery_price: newPrice });
      toast.success("✅ تم تحديث سعر التوصيل بنجاح");
      refetch();
    } catch (error) {
      toast.error("❌ فشل تحديث السعر");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "rgba(122,145,255,0.05)", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color={smoothBlue}
        mb={4}
        textAlign="center"
      >
        قائمة المحافظات
      </Typography>

      {loading ? (
        <Typography textAlign="center" mt={4} color={smoothBlue}>
          جاري التحميل...
        </Typography>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-2xl overflow-hidden">
            <thead style={{ backgroundColor: smoothBlue }} className="text-white">
              <tr>
                <th className="py-3 px-6 text-start">#</th>
                <th className="py-3 px-6 text-start">المحافظة</th>
                <th className="py-3 px-6 text-start">سعر التوصيل</th>
                <th className="py-3 px-6 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {governorates?.data.map((gov, idx) => (
                <tr
                  key={gov.id}
                  className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
                >
                  <td className="py-3 px-6">{idx + 1}</td>
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {gov.name}
                  </td>
                  <td className="py-3 px-6">
                    <TextField
                      size="small"
                      type="text"
                      value={prices[gov.id] ?? gov.delivery_price}
                      onChange={(e) => handleChange(gov.id, e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Button
                      onClick={() => handleSave(gov.id)}
                      sx={{
                        bgcolor: smoothBlue,
                        color: "#fff",
                        "&:hover": { bgcolor: "#5F78E0" },
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      حفظ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Box>
  );
};

export default GovernoratesPage;
