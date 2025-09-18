import { useState, type ChangeEvent, type FormEvent } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconifyIcon from "../../components/ui/IconifyIcon";
import useLogin, { API_URL } from "./useLogin";

interface User {
  [key: string]: string;
}

const Login = () => {
    const { login, loading } = useLogin();
  const [user, setUser] = useState<User>({ email: "", password: "" ,fcm_token:"1"});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
   e.preventDefault();
    login(API_URL+"login", user);
  };

  return (
<Box
  dir="rtl"
  minHeight="100vh"
  display="flex"
  justifyContent="center"
  alignItems="center"
  bgcolor="#00000025"
  px={2}
>
  {/* Modal Box */}
  <Box
    maxWidth={400}
    width="100%"
    bgcolor="#fff"
    boxShadow="0 15px 35px rgba(0,0,0,0.2)"
    borderRadius={4}
    p={5}
    sx={{ transition: "all 0.3s ease" }}
  >
    {/* العنوان */}
    <Typography
      align="center"
      variant="h4"
      gutterBottom
      fontWeight={600}
      color="#7A91FF" // العنوان باللون الجديد
    >
      تسجيل الدخول
    </Typography>
    <Typography
      mt={1}
      align="center"
      variant="body2"
      color="#7A91FF" // النص الثانوي باللون الجديد
    >
      أهلاً بعودتك! يمكنك المتابعة باستخدام بريدك الإلكتروني
    </Typography>

    {/* Form */}
    <Stack component="form" onSubmit={handleSubmit} spacing={3} mt={3}>
      <TextField
        id="email"
        name="email"
        type="email"
        value={user.email}
        onChange={handleInputChange}
        variant="outlined"
        placeholder="البريد الإلكتروني"
        autoComplete="email"
        fullWidth
        required
        autoFocus
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#f5f5f5",
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "#7A91FF" },
            "&.Mui-focused fieldset": { borderColor: "#7A91FF" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconifyIcon
                icon="ic:baseline-alternate-email"
                width={22}
                height={22}
                color="#7A91FF"
              />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={user.password}
        onChange={handleInputChange}
        variant="outlined"
        placeholder="كلمة المرور"
        autoComplete="current-password"
        fullWidth
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#f5f5f5",
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "#7A91FF" },
            "&.Mui-focused fieldset": { borderColor: "#7A91FF" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconifyIcon
                icon="ic:outline-lock"
                width={22}
                height={22}
                color="#7A91FF"
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                opacity: user.password ? 1 : 0,
                pointerEvents: user.password ? "auto" : "none",
              }}
            >
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ p: 0 }}
              >
                <IconifyIcon
                  icon={
                    showPassword
                      ? "ic:outline-visibility"
                      : "ic:outline-visibility-off"
                  }
                  width={22}
                  height={22}
                  color="#7A91FF"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 3,
          bgcolor: "#7A91FF", // زر باللون الجديد
          color: "#fff",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 5px 20px rgba(122,145,255,0.4)",
          "&:hover": {
            bgcolor: "#5f78e6",
            color: "#fff",
            boxShadow: "0 7px 25px rgba(122,145,255,0.5)",
          },
        }}
      >
        {loading ? "جاري التحميل" : "تسجيل الدخول"}
      </Button>
    </Stack>
  </Box>
</Box>



  );
};

export default Login;
