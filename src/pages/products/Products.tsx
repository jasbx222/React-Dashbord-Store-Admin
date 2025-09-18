import { useState, useEffect, type FormEvent } from "react";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Drawer,
  IconButton,
} from "@mui/material";
import { smoothBlue } from "../coupon/Coupons";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getDecryptedToken } from "../../hooks/DecryptToken";
import ProductModalForm, {
  TableProducts,
} from "../../components/pages/products/ProductsComp";
import useGetData from "../../hooks/useGetData";
import type { Product } from "../../types/types";
import usePost from "../../hooks/usePost";
import { Pagination } from "@mui/material";
import { ClosedCaption, Filter } from "lucide-react";

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ProductsResponse {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  meta: PaginationMeta;
}
type Categories = {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  };
};
type Category = {
  parent: {
    id: number;
    name: string;
  };
  Categories: Categories[];
};

export default function Products() {
  const [category, setCategory] = useState<string>("الكل");
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false); // سايد بار فلترة
  const [filterApplied, setFilterApplied] = useState(false); // فلترة مفعلة

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category_id: 0,
    quantity: 0,
    price: 0,
    price_after: 0,
    is_offer: false,
    offer_name: "",
    image: null as File | null,
  });

  // Fetch categories
  const { data: categories, refetch } = useGetData<Category>("categories") || [];
  const url = import.meta.env.VITE_BASE_URL;

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get<ProductsResponse>(
        `${url}products?page=${page}`,
        {
          headers: { Authorization: `Bearer ${getDecryptedToken()}` },
        }
      );
      setProducts(res.data.products.data);
      setPagination({
        current_page: res.data.products.current_page,
        last_page: res.data.products.last_page,
        per_page: res.data.products.per_page,
        total: res.data.products.total,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  // Handle add product form submission
  const { add } = usePost();

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("category_id", newProduct.category_id.toString());
    formData.append("quantity", newProduct.quantity.toString());
    formData.append("price", newProduct.price.toString());
    formData.append("price_after", newProduct.price_after?.toString() || "0");
    formData.append("is_offer", newProduct.is_offer ? "1" : "0");
    formData.append("offer_name", newProduct.offer_name || "");
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      await add("products", formData, true);
      setOpenModal(false);
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        category_id: 0,
        quantity: 0,
        price: 0,
        price_after: 0,
        is_offer: false,
        offer_name: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // فلترة المنتجات
  const filteredProducts =
    category === "الكل"
      ? products
      : products.filter((p) => p.category?.name === category);

  const handleExportExcel = () => {
    if (!filteredProducts.length) return;

    const dataForExcel = filteredProducts.map((p) => ({
      "اسم المنتج": p.name,
      الفئة: p.category?.name || "غير محدد",
      الكمية: p.quantity,
      السعر: p.price,
      "السعر بعد الخصم": p.price_after,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Products_${new Date().toISOString()}.xlsx`);
  };

  const filteredProduct = Array.isArray(filteredProducts)
    ? filteredProducts.filter((cp: any) =>
        cp.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 min-h-screen bg-white/90 text-[#4329fc]">
      <Typography
        variant="h4"
        fontWeight={700}
        color={smoothBlue}
        mb={4}
        textAlign="center"
      >
        المنتجات
      </Typography>

      {/* زر فتح الفلترة */}
      <Stack
        direction="row"
        className="flex justify-between items-center"
        spacing={2}
        mb={4}
      >
       <Button
          variant="contained"
          startIcon={<Filter size={18} />}
          onClick={() => setFilterOpen(true)}
          sx={{
            backgroundColor: smoothBlue,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          تصفية
        </Button>

        <Button
          onClick={() => setOpenModal(true)}
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
          إضافة منتج
        </Button>
      </Stack>

      {/* زر تصدير يظهر فقط اذا فلترة مفعلة */}
      {filterApplied && (
        <Button
          onClick={handleExportExcel}
          sx={{
            bgcolor: "#4CAF50",
            color: "#fff",
            "&:hover": { bgcolor: "#45A049", color: "#fff" },
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            mb: 3,
          }}
        >
         تصدير Excel
        </Button>
      )}

      <TableProducts
        products={filteredProduct}
        pagination={pagination}
        refetch={refetch}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {openModal && (
        <ProductModalForm
          categories={categories?.Categories.filter((c) => c.parent) || []}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSubmit={handleAddProduct}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* ✅ Pagination Section */}
      <div className="flex justify-center mt-6">
        <Pagination
          count={pagination.last_page}
          page={pagination.current_page}
          onChange={(_, value) => handlePageChange(value)}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
      </div>

      {/* Drawer للفلترة */}
      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <div className="w-80 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">تصفية المنتجات</Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <ClosedCaption />
            </IconButton>
          </div>

          <TextField
            label="اسم المنتج"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          >
            <option value="الكل">الكل</option>
            {products
              .map((p) => p.category)
              .filter(
                (value, index, self) =>
                  value && self.findIndex((c) => c?.id === value.id) === index
              )
              .map((c) => (
                <option key={c!.id} value={c!.name}>
                  {c!.name}
                </option>
              ))}
          </select>

          <Button
            onClick={() => {
              setFilterApplied(true);
              setFilterOpen(false);
            }}
            sx={{
              bgcolor: smoothBlue,
              color: "#fff",
              "&:hover": { bgcolor: smoothBlue + "CC", color: "#fff" },
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            تطبيق الفلترة
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
