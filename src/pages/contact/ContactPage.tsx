import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import useGetData from "../../hooks/useGetData";
import useUpdate from "../../hooks/useUpdate";
import { toast } from "react-toastify";
import { Phone } from "lucide-react";


const smoothBlue = "#7A91FF";

interface DataContact {
  id: number;
  whatsappLink: string;
}
interface ContactInfo {
  data: DataContact;
}

export default function ContactInfoPage() {
  const { data: contactData, refetch } = useGetData<ContactInfo>("contact-info");
  const { update } = useUpdate();
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    if (contactData?.data?.whatsappLink) {
      setWhatsappLink(contactData.data.whatsappLink);
    }
  }, [contactData]);

  const handleSave = async () => {
    if (!contactData?.data?.id) return;

    if (!whatsappLink.startsWith("https://wa.me/")) {
      toast.error("يجب أن يبدأ الرابط بـ https://wa.me/");
      return;
    }

    try {
      await update(`contact-info/${contactData.data.id}`, {
        whatsapp_link: whatsappLink,
      });
      toast.success("تم حفظ رابط الواتساب بنجاح!");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ. حاول مرة أخرى.");
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#F5F7FF] min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center" style={{ color: smoothBlue }}>
        إدارة رابط الواتساب
      </h1>

      <Card className="p-6 shadow-xl rounded-2xl border-0 bg-white w-full max-w-lg">
        <CardHeader>
          <CardTitle
            className="text-xl font-semibold text-center"
            style={{ color: smoothBlue }}
          >
            تعديل الرابط
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-6 h-6" />
            <Input
              type="text"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              placeholder="ضع رابط واتساب هنا (https://wa.me/...)"
              className="rounded-xl h-[60px] pl-12 border-[rgba(122,145,255,0.3)] focus:ring-[rgba(122,145,255,0.5)] focus:border-[rgba(122,145,255,0.7)] transition-all"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full rounded-xl shadow-lg hover:scale-105 transition-transform"
            style={{ backgroundColor: smoothBlue, color: "#fff" }}
          >
            حفظ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
