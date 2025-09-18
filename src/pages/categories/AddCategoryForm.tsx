import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import useGetData from "../../hooks/useGetData";
import usePost from "../../hooks/usePost";
import { toast } from "react-toastify";
type Category = {
  id: number;
  name: string;
  parent?: {
    id: number;
    name: string;
  } | null;
};

export default function AddCategoryForm() {
  const { data: categories, refetch } = useGetData<{ Categories: Category[]}>("categories"); // جلب الأقسام الحالية
  const navigator = window.history;

  const [form, setForm] = useState({
    name: "",
    image: null as File | null,
    parent_id: "" // إضافة parent_id
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { add } = usePost();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("parent_id", form.parent_id || ""); // إرسال parent_id (فارغ إذا قسم رئيسي)
    if (form.image) formData.append("image", form.image);

    try {
      await add("categories", formData, true);
      toast.success("تم إضافة القسم بنجاح");
      setForm({ name: "", image: null, parent_id: "" });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 w-full max-w-md flex flex-col gap-6 shadow-lg"
        encType="multipart/form-data"
      >
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          إضافة قسم جديد
        </Typography>

        <TextField
          label="اسم القسم"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />

<FormControl fullWidth>
  <InputLabel id="parent-label">القسم الأب (اختياري)</InputLabel>
  <Select
    labelId="parent-label"
    name="parent_id"
    value={form.parent_id}
    onChange={handleChange}
    label="القسم الأب"
  >
    {/* الخيار الافتراضي للقسم الرئيسي */}
    <MenuItem value="">قسم رئيسي</MenuItem>

    {/* الأقسام الرئيسية */}
    {categories?.Categories
      .filter((cat) => !cat.parent?.id)
      .map((main) => (
        <MenuItem key={main.id} value={main.id}>
          {main.name}
        </MenuItem>
      ))}

    
  </Select>
</FormControl>



        <TextField
          type="file"
          name="image"
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => navigator.back()}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="contained" color="primary">
            حفظ
          </Button>
        </div>
      </form>
    </div>
  );
}
