import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { MoreVertical, Lock, Unlock, FileText } from "lucide-react";
import useGetData from "../../hooks/useGetData";
import usePost from "../../hooks/usePost";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";

interface Client {
  id: number;
  phone:string;
  name: string;
  email: string;
  is_active: boolean;
}

interface ClientsResponse {
  client: Client[];
}

export default function ClientsPage() {
  const { data: clientsData, refetch, loading } =
    useGetData<ClientsResponse>("clients");
  const { add } = usePost();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    clientId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClientId(null);
  };

  const handleBlockToggle = async (client: Client) => {
    try {
      await add(`clients/${client.id}/block`, { is_active: !client.is_active });
      toast.success(client.is_active ? "تم حظر العميل!" : "تم إلغاء الحظر!");
      refetch?.();
    } catch {
      toast.error("حدث خطأ أثناء تحديث حالة العميل.");
    } finally {
      handleMenuClose();
    }
  };

  const filteredClient =
    clientsData?.client.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" align="center" color="#7A91FF" gutterBottom>
        إدارة العملاء
      </Typography>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <TextField
          label="ابحث عن عميل..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : filteredClient.length ? (
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <Table>
            <TableHead style={{ backgroundColor: "#7A91FF" }}>
              <TableRow>
                <TableCell style={{ color: "#fff" }}>#</TableCell>
                <TableCell style={{ color: "#fff" }}>الاسم</TableCell>
                <TableCell style={{ color: "#fff" }}>الإيميل</TableCell>
                <TableCell style={{ color: "#fff" }}>الهاتف</TableCell>
                <TableCell style={{ color: "#fff" }}>الحالة</TableCell>
                <TableCell style={{ color: "#fff", textAlign: "center" }}>
                  الفواتير
                </TableCell>
                <TableCell style={{ color: "#fff", textAlign: "center" }}>
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClient.map((client, idx) => (
                <TableRow key={client.id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell
                    style={{
                      textDecoration: client.is_active ? "none" : "line-through",
                    }}
                  >
                    {client.name}
                  </TableCell>
                  <TableCell
                    style={{
                      textDecoration: client.is_active ? "none" : "line-through",
                    }}
                  >
                    {client.email}
                  </TableCell>
                  <TableCell style={{ color: client.is_active ? "green" : "red" }}>
                    {client.is_active ? "نشط" : "محظور"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      startIcon={<FileText size={18} />}
                      component={Link}
                      to={`/client/${client.id}`}
                    >
                      
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton onClick={(e) => handleMenuOpen(e, client.id)}>
                      <MoreVertical size={20} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={selectedClientId === client.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleBlockToggle(client)}>
                        {client.is_active ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )}
                        &nbsp;{client.is_active ? "بلوك" : "إلغاء الحظر"}
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" color="textSecondary">
          لا يوجد عملاء
        </Typography>
      )}
    </div>
  );
}
