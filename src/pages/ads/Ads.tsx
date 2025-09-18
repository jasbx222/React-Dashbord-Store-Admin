import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Button,
  Typography,
  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { smoothBlue } from "../coupon/Coupons";
import useGetData from "../../hooks/useGetData";
import useDelete from "../../hooks/useDelete";
import type { Ad, AdsResponse } from "../../types/types";
import Loading from "../../components/ui/Loading";
import AddModel from "../../components/pages/ads/AddModel";

export default function AdsDashboard() {
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useGetData<AdsResponse>(`ads?page=${page}`);
  const { remove } = useDelete();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ad | null>(null);

  const ads = data?.ads || [];
  const meta = data?.meta || { current_page: 1, last_page: 1 };

  const openModal = (item?: Ad) => {
    setEditingItem(item || null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(`ads/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4" fontWeight={700} color={smoothBlue}>
          الإعلانات
        </Typography>
        <Button
          onClick={() => openModal()}
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
          <Plus size={18} className="mr-2" />
          إضافة إعلان
        </Button>
      </div>

      {/* جدول الإعلانات */}
      <div className="rounded-2xl bg-white shadow p-4 overflow-x-auto">
        {loading ? (
          <Loading />
        ) : ads.length === 0 ? (
          <p className="text-gray-500 text-center py-6">لا توجد إعلانات</p>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">العنوان</TableCell>
            
                  <TableCell align="center">الصورة</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ads.map((ad, index) => (
                  <TableRow
                    key={ad.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell align="center">
                      {(meta.current_page - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell align="center">{ad.title}</TableCell>
                  
                    <TableCell align="center">
                      {ad.image && (
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-16 h-16 object-cover rounded-md mx-auto border"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          color="primary"
                          onClick={() => openModal(ad)}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                count={meta.last_page}
                page={meta.current_page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </div>
          </>
        )}
      </div>

      {/* المودال */}
      <AddModel
        item={editingItem || undefined}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        refetch={refetch}
      />
    </div>
  );
}
