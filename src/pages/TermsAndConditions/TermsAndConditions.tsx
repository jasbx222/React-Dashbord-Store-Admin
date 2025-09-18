import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import TextField from "@mui/material/TextField";
import { Button } from "../../components/ui/button";
import { Stack } from "@mui/material";
import { toast } from "react-toastify";
import useGetData from "../../hooks/useGetData";
import type { Term } from "../../types/types";
import useUpdate from "../../hooks/useUpdate";

const smoothBlue = "#7A91FF";

export default function TermsAndConditionsPage() {
  const { data: termsAndConditions, refetch } = useGetData<Term>("terms-and-conditions");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // تحديث الـ state عند وصول البيانات من الباك
  useEffect(() => {
    if (termsAndConditions?.data) {
      setTitle(termsAndConditions.data.title);
      setContent(termsAndConditions.data.content);
    }
  }, [termsAndConditions]);

  const { update } = useUpdate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!termsAndConditions?.data?.id) return; // تأكد أن الـ id موجود

  try {
    await update(`terms-and-conditions/${termsAndConditions.data.id}`, { title, content });
    toast.success("تم تعديل الشروط والأحكام بنجاح!");
    refetch();
  } catch (error) {
    toast.error("حدث خطأ أثناء تعديل الشروط والأحكام. حاول مرة أخرى.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF] p-6">
      <Card className="w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 bg-white">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-2xl font-bold text-center"
            style={{ color: smoothBlue }}
          >
            تعديل الشروط والأحكام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <TextField
                fullWidth
                label="العنوان"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{ style: { borderRadius: 16, backgroundColor: "#F5F7FF" } }}
              />
              <TextField
                fullWidth
                label="الوصف"
                variant="outlined"
                multiline
                minRows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                InputProps={{ style: { borderRadius: 16, backgroundColor: "#F5F7FF" } }}
              />
              <Button
                type="submit"
                className="w-full rounded-xl text-white font-semibold py-3 text-lg shadow-lg transition-all"
                style={{ backgroundColor: smoothBlue }}
              >
                حفظ التعديلات
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
