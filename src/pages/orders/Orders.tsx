import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Drawer,
  TextField,
  Box,
  IconButton,
  Divider,
  TablePagination, // ✨
} from "@mui/material";
import useGetData from "../../hooks/useGetData";
import usePost from "../../hooks/usePost";
import Loading from "../../components/ui/Loading";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ScanEyeIcon, Filter, X } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const smoothBlue = "#7A91FF";

type OrderStatus =
  | "pending"
  | "accepted"
  | "returned"
  | "completed"
  | "cancelled";

const statusLabels: Record<OrderStatus, string> = {
  pending: "معلق",
  accepted: "مقبول",
  returned: "مسترجع",
  completed: "مكتمل",
  cancelled: "ملغى",
};

type Client = {
  id: number;
  phone: string;
  name: string;
};

interface OrderItem {
  id: number;
  client: Client;
  status: OrderStatus;
  total_with_delivery_price: number;
  product?: any[];
  address?: { name?: string };
}

interface Order {
  orders: OrderItem[];
}

export default function OrdersPage() {
  const { data: ordersData, loading, refetch } = useGetData<Order>("orders");
  const { add } = usePost();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");
  const [searchClient, setSearchClient] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  // ✨ Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (ordersData?.orders) setOrders(ordersData.orders);
  }, [ordersData]);

  const filteredOrders = orders.filter((o) => {
    const byStatus = filterStatus ? o.status === filterStatus : true;
    const byClient = searchClient
      ? o.client?.name?.toLowerCase().includes(searchClient.toLowerCase())
      : true;
    return byStatus && byClient;
  });

  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    try {
      await add(`orders/${id}/status`, { status: newStatus });
      toast.success("تم تعديل حالة الطلب بنجاح!");
      refetch();
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      toast.error("حدث خطأ أثناء تعديل حالة الطلب.");
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    if (!filteredOrders.length) return;

    const dataForExcel = filteredOrders.map((o) => ({
      "رقم الطلب": o.id,
      العميل: o.client?.name || "-",
      "عدد المنتجات": o.product?.length || 0,
      العنوان: o.address?.name || "-",
      الحالة: statusLabels[o.status],
      المجموع: o.total_with_delivery_price + " د.ع",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Orders_${new Date().toISOString()}.xlsx`);
  };

  // ✨ slice للـ pagination
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="min-h-screen p-6 bg-[#F5F7FF]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: smoothBlue }}>
          إدارة الطلبات
        </h1>
        <Button
          variant="contained"
          startIcon={<Filter size={18} />}
          onClick={() => setOpenFilter(true)}
          sx={{
            backgroundColor: smoothBlue,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          تصفية
        </Button>
      </div>

      {/* Drawer الفلاتر */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Box sx={{ width: 320, padding: 3 }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold" style={{ color: smoothBlue }}>
              تصفية الطلبات
            </h2>
            <IconButton onClick={() => setOpenFilter(false)}>
              <X size={20} />
            </IconButton>
          </div>
          <Divider sx={{ mb: 2 }} />
          <div style={{ marginBottom: "16px" }}>
            <TextField
              label="اسم العميل"
              variant="outlined"
              fullWidth
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">كل الحالات</MenuItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Button
            variant="contained"
            sx={{ backgroundColor: smoothBlue }}
            onClick={handleExportExcel}
          >
            تصدير Excel
          </Button>
        </Box>
      </Drawer>

      {loading ? (
        <Loading />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: smoothBlue }}>
                <TableCell sx={{ color: "#fff" }}>رقم الطلب</TableCell>
                <TableCell sx={{ color: "#fff" }}>العميل</TableCell>
                <TableCell sx={{ color: "#fff" }}>الهاتف</TableCell>

                <TableCell sx={{ color: "#fff" }}>العنوان</TableCell>
                <TableCell sx={{ color: "#fff" }}>عدد المنتجات</TableCell>
                <TableCell sx={{ color: "#fff" }}>المجموع</TableCell>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.length ? (
                paginatedOrders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                      "&:hover": { backgroundColor: "#eef2ff" },
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order?.client?.name}</TableCell>
                    <TableCell>{order?.client?.phone}</TableCell>
                    <TableCell>{order.address?.name || "-"}</TableCell>
                    <TableCell>{order.product?.length || 0}</TableCell>

                    <TableCell>{order.total_with_delivery_price} د.ع</TableCell>
                    <TableCell align="center">
                      <div className="flex gap-2 items-center justify-center">
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          size="small"
                          sx={{
                            minWidth: 110,
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            backgroundColor: "#fafafa",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease-in-out",
                            "& .MuiSelect-select": {
                              paddingY: "6px",
                              paddingX: "12px",
                            },
                            "&:hover": {
                              backgroundColor: "#f5f7ff",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d1d5db",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#9ca3af",
                            },
                          }}
                        >
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <MenuItem
                              key={key}
                              value={key}
                              sx={{
                                fontSize: "0.85rem",
                                borderRadius: "8px",
                                "&:hover": {
                                  backgroundColor: "#eef2ff",
                                },
                              }}
                            >
                              {label}
                            </MenuItem>
                          ))}
                        </Select>

                        <Button
                          component={Link}
                          to={`/orders/${order.id}`}
                          variant="outlined"
                          startIcon={<ScanEyeIcon size={18} />}
                          sx={{
                            borderColor: smoothBlue,
                            color: smoothBlue,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            "&:hover": {
                              backgroundColor: "#f0f3ff",
                            },
                          }}
                        >
                          عرض
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
       <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={(newPage:any) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="عدد الصفوف"
          />
    </div>
  );
}
