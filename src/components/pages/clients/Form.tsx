import { Button, Modal, Box, TextField } from "@mui/material";
import { smoothBlue } from "../../../pages/coupon/Coupons";
import { type Dispatch, type SetStateAction } from "react";

interface ClientForm {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface FormProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  form: ClientForm;
  setForm: Dispatch<SetStateAction<ClientForm>>;
  handleAddClient: () => void;
}

const Form: React.FC<FormProps> = ({
  modalOpen,
  setModalOpen,
  setForm,
  handleAddClient,
  form,
}) => {

  return (
     <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2 className="text-xl font-semibold text-center mb-2">
            إضافة عميل جديد
          </h2>
          <TextField
            label="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="رقم الهاتف"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="الإيميل"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="كلمة المرور"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
          />
          <Button
            onClick={handleAddClient}
            sx={{
              mt: 2,
              bgcolor: smoothBlue,
              color: "#fff",
              "&:hover": { bgcolor: smoothBlue + "CC" },
              borderRadius: 2,
              fontWeight: 600,
              py: 1.2,
            }}
          >
            حفظ
          </Button>
        </Box>
      </Modal>
  )
}

export default Form