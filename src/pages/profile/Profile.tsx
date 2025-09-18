
import { Button, Typography, Paper } from "@mui/material";
import Loading from "../../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import usePost from "../../hooks/usePost";
type Profile ={
 id: number;
  name: string;
  email: string;
}
interface UserProfile {
 profile:Profile

}

export default function ProfilePage() {
 
  const navigate = useNavigate();

 const {data:profile,loading}=useGetData<UserProfile>('profile')

  const {add}=usePost()

  const handleLogout = async () => {
    try {
      await add("logout",null); 
      localStorage.removeItem("token"); 
      navigate("/login");
    } catch (error) {
      console.error("حدث خطأ أثناء تسجيل الخروج", error);
    }
  };

  if (loading) return <Loading />;

  if (!profile)
    return (
      <Typography className="text-center mt-10" variant="h6">
        لا يوجد بيانات للملف الشخصي
      </Typography>
    );

  return (
    <div className="p-6 bg-[#F5F7FF] min-h-screen flex justify-center items-start">
      <Paper className="p-6 max-w-md shadow-lg rounded-2xl w-full">
        <Typography variant="h5" className="mb-4 font-bold" style={{ color: "#7A91FF" }}>
          الملف الشخصي
        </Typography>

        <Typography className="mb-2">الاسم: {profile.profile.name}</Typography>
        <Typography className="mb-2">الإيميل: {profile.profile.email}</Typography>
        {/* أضف أي بيانات أخرى هنا */}

        <Button
          onClick={handleLogout}
          variant="contained"
          style={{ backgroundColor: "#FF6B6B", marginTop: "20px" }}
        >
          تسجيل الخروج
        </Button>
      </Paper>
    </div>
  );
}
