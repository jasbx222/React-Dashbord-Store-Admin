import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useGetData from "../../hooks/useGetData";
import Loading from "../../components/ui/Loading";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LucideScanEye } from "lucide-react";

interface Invoice {
  id: number;
  client: string;
  status: string;
  coupon_id: string;
  discount: number;
  delivery_price: number;
  total: number;
}

export default function InvoiceTable() {
  const { id } = useParams();
  const { data, loading } = useGetData<{ data: Invoice[] }>(
    `client/${id}/orders`
  );

  const transStatus =(status:string)=>{

    switch (status) {
      case 'completed':
        return 'مكتملة'

    }
  }
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice_${selectedInvoice?.id}.pdf`);
  };

  if (loading) return <Loading />;

  if (!data?.data?.length)
    return (
      <Typography style={{ textAlign: "center", marginTop: "40px" }} variant="h6">
        لا توجد فواتير
      </Typography>
    );

  return (
    <div style={{ padding: "24px", backgroundColor: "#F5F7FF", minHeight: "100vh" }}>
      <Paper style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "16px" }}>
        <Typography
          variant="h5"
          style={{ marginBottom: "16px", fontWeight: "bold", color: "#7A91FF" }}
        >
          الفواتير
        </Typography>

        {/* جدول الفواتير */}
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead style={{ backgroundColor: "#7A91FF" }}>
              <TableRow>
                {["#", "العميل", "الحالة", "الكوبون", "الخصم", "التوصيل", "الإجمالي", "إجراءات"].map((header) => (
                  <TableCell key={header} style={{ color: "#fff", fontWeight: "bold" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{transStatus(invoice.status)}</TableCell>
                  <TableCell>{invoice.coupon_id}</TableCell>
                  <TableCell>{invoice.discount}</TableCell>
                  <TableCell>{invoice.delivery_price}</TableCell>
                  <TableCell>{invoice.total}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      style={{ marginRight: "8px", backgroundColor: "#fff", color: "#7A91FF", border: "1px solid #7A91FF" }}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
             <LucideScanEye/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* مودال التفاصيل + زر PDF */}
        <Dialog
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>تفاصيل الفاتورة</DialogTitle>
          <DialogContent dividers>
            {selectedInvoice && (
              <div
                ref={invoiceRef}
                style={{
                  fontFamily: "Amiri, Arial, sans-serif",
                  padding: "20px",
                  lineHeight: 1.6,
                  direction: "rtl",
                  textAlign: "right",
                  border: "1px solid #ddd",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
              >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>فاتورة</h2>
                <p><strong>رقم الفاتورة:</strong> {selectedInvoice.id}</p>
                <p><strong>العميل:</strong> {selectedInvoice.client}</p>
                <p><strong>الحالة:</strong>{
transStatus(selectedInvoice.status)}</p>
                <p><strong>الكوبون:</strong> {selectedInvoice.coupon_id}</p>
                <p><strong>الخصم:</strong> {selectedInvoice.discount}</p>
                <p><strong>سعر التوصيل:</strong> {selectedInvoice.delivery_price}</p>
                <p><strong>الإجمالي:</strong> {selectedInvoice.total}</p>
                <hr style={{ margin: "20px 0", borderColor: "#ccc" }} />
                <p style={{ textAlign: "center" }}>شكراً لتعاملكم معنا</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedInvoice(null)}>إغلاق</Button>
            <Button
              onClick={exportPDF}
              variant="contained"
              style={{ backgroundColor: "#7A91FF", color: "#fff" }}
            >
              تصدير PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
}
