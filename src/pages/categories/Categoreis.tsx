import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { smoothBlue } from "../coupon/Coupons";
import useGetData from "../../hooks/useGetData";
import useDelete from "../../hooks/useDelete";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";
import type { DepartmentsResponse } from "../../types/categories";
import { Link } from "react-router-dom";

export const Categories: React.FC = () => {
  const { data: departments, refetch, loading } = useGetData<DepartmentsResponse>("categories");
  const { remove } = useDelete();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Dialog للقسم الرئيسي
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null);

  // Dialog للقسم الفرعي
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  const handleOpenMainDialog = (categoryId: number) => {
    setSelectedMainCategory(categoryId);
    setOpenMainDialog(true);
  };

  const handleCloseMainDialog = () => {
    setSelectedMainCategory(null);
    setOpenMainDialog(false);
  };

  const handleOpenSubDialog = (subCategoryId: number) => {
    setSelectedSubCategory(subCategoryId);
    setOpenSubDialog(true);
  };

  const handleCloseSubDialog = () => {
    setSelectedSubCategory(null);
    setOpenSubDialog(false);
  };

  const deleteDepartment = (id: number) => {
    try {
      remove(`categories/${id}`);
      toast.success("تم حذف القسم بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف القسم");
      console.error(error);
    }
  };

  if (loading) return <Loading />;

  const mainCategories = departments?.Categories?.filter((cat) => !cat.parent?.id);
  const selectedSub = departments?.Categories?.find(c => c.id === selectedSubCategory);

  return (
    <Box className="p-4 sm:p-8 min-h-screen bg-white/90">
      <Typography variant="h4" fontWeight={700} color={smoothBlue} mb={4} textAlign="center">
        الأقسام الرئيسية
      </Typography>

      <Box display="flex" justifyContent="end" mb={4}>
        <Link to="/categories/add" style={{ textDecoration: "none" }}>
          <Button
            sx={{
              bgcolor: smoothBlue,
              color: "#fff",
              "&:hover": { bgcolor: smoothBlue + "CC" },
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "0 5px 20px rgba(122,145,255,0.3)",
              textTransform: "none",
            }}
          >
            إضافة قسم
          </Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                 {!isMobile && <TableCell>الصورة</TableCell>}
              <TableCell>القسم الرئيسي</TableCell>
           
              <TableCell>عدد المنتجات</TableCell>
              {!isMobile && <TableCell>تاريخ الإنشاء</TableCell>}
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainCategories?.map((category) => (
              <TableRow key={category.id} hover>
                {!isMobile && (
                  <TableCell>
                    <img src={category.image} alt={category.name} width={50} height={50} />
                  </TableCell>
                )}
                <TableCell
                  sx={{ cursor: "pointer", fontWeight: 500 }}
                  onClick={() => handleOpenMainDialog(category.id)}
                >
                  {category.name}
                </TableCell>
                
                <TableCell>{category.products_count}</TableCell>
                {!isMobile && <TableCell>{category.created_at}</TableCell>}
                <TableCell>
                  <IconButton color="error" onClick={() => deleteDepartment(category.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog القسم الرئيسي: عرض الأقسام الفرعية */}
      <Dialog
        open={openMainDialog}
        onClose={handleCloseMainDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>الأقسام الفرعية</DialogTitle>
        <DialogContent>
          <List dense>
            {departments?.Categories
              ?.filter((sub) => sub.parent?.id === selectedMainCategory)
              .map((sub) => (
                <ListItem
                  key={sub.id}
                  sx={{ bgcolor: "#e3f2fd", borderRadius: 1, mb: 0.5, cursor: "pointer" }}
                  onClick={() => handleOpenSubDialog(sub.id)}
                >
                  <ListItemText primary={sub.name} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Dialog القسم الفرعي: عرض المنتجات */}
     <Dialog
  open={openSubDialog}
  onClose={handleCloseSubDialog}
  fullWidth
  maxWidth="md"
  fullScreen={isMobile}
>
  <DialogTitle>المنتجات المرتبطة</DialogTitle>
  <DialogContent>
    <List dense>
      {selectedSub?.products?.map((p) => (
        <ListItem
          key={p.id}
          component={Link}             // <--- هنا نضيف الرابط
          to={`/products/${p.id}`}      // <--- رابط صفحة المنتج
          sx={{
            bgcolor: "#f0f4c3",
            borderRadius: 1,
            mb: 0.5,
            cursor: "pointer",
            textDecoration: "none",
            color: "inherit",
            "&:hover": { bgcolor: "#e6f0b3" },
          }}
          onClick={handleCloseSubDialog} // يغلق Dialog عند الانتقال
        >
          <ListItemText primary={`${p.name} (${p.quantity})`} />
        </ListItem>
      ))}
    </List>
  </DialogContent>
</Dialog>
    </Box>
  );
};
