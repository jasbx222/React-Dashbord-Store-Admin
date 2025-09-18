import Home from "./components/pages/home/Home";
import AdsDashboard from "./pages/ads/Ads";
import Products from "./pages/products/Products";
import { Categories } from "./pages/categories/Categoreis";
import Coupons from "./pages/coupon/Coupons";
import GovernoratesPage from "./pages/governorates/Governorates";

import ContactInfo from "./pages/contact/ContactPage";
import TermsAndConditionsPage from "./pages/TermsAndConditions/TermsAndConditions";

import { 
  Home as HomeIcon, 
  FileText,  
  BadgePercent, 
  SmartphoneNfc, 
  HeartHandshake, 
  Layers, 
  ShoppingBag,
  MapPinHouse,
  User,
  Settings,
  ReceiptPoundSterling
} from "lucide-react";
import ProductDetails from "./pages/products/ProductShow";
import FormUpdate from "./components/pages/products/FormUpdate";
import AddCategoryForm from "./pages/categories/AddCategoryForm";
import CategoryDetails from "./pages/categories/CategoryDetails";
import OrdersPage from "./pages/orders/Orders";
import ClientsPage from "./pages/clients/Clients";
import OrderDetailsPage from "./pages/orders/OrdersDetailes";
import Reports from "./pages/reports/Reports";
import InvoiceDetails from "./pages/clients/ClientInvioce";
import ProfilePage from "./pages/profile/Profile";

 export const routes = [
  // المجموعة الرئيسية
  {
    id: 1,
    element: <Home />,
    href: "/home",
    title: "الصفحة الرئيسية",
    icon: HomeIcon,
    group: "main",
  },
  {
    id: 2,
    element: <Products />,
    href: "/products",
    title: "المنتجات",
    icon: ShoppingBag,
    group: "main",
  },
  {
    id: 3,
    element: <Categories />,
    href: "/categories",
    title: "الفئات",
    icon: Layers,
    group: "main",
  },
  {
    id: 4,
    element: <AdsDashboard />,
    href: "/ads",
    title: "الإعلانات",
    icon: FileText,
    group: "main",
  },
  {
    id: 5,
    element: <Coupons />,
    href: "/coupons",
    title: "الخصومات",
    icon: BadgePercent,
    group: "main",
  },
  {
    id: 6,
    element: <GovernoratesPage />,
    href: "/governorates",
    title: "المحافظات",
    icon: MapPinHouse,
    group: "main",
  },
  {
    id: 8,
    element: <ContactInfo />,
    href: "/contactInfo",
    title: "معلومات التواصل",
    icon: SmartphoneNfc,
    group: "main",
  },
  {
    id: 9,
    element: <TermsAndConditionsPage />,
    href: "/terms_and_conditions",
    title: "الشروط والأحكام",
    icon: HeartHandshake,
    group: "main",
  },
  {
    id: 14,
    element: <OrdersPage />,
    href: "/orders",
    title: "الطلبات",
    icon: FileText,
    group: "main",
  },
  {
    id: 15,
    element: <ClientsPage />,
    href: "/clients",
    title: "العملاء",
    icon: User,
    group: "main",
  },
  {
    id: 16,
    element: <Reports />,
    href: "/reports",
    title: "التقارير",
    icon: ReceiptPoundSterling,
    group: "main",
  },
  {
    id: 18,
    element: <ProfilePage />,
    href: "/profile",
    title: "البروفايل",
    icon: User,
    group: "main",
  },

  // المجموعة الفرعية (عكروبات)
  {
    id: 10,
    element: <ProductDetails />,
    href: "/products/:id",
    group: "sub",
  },
  {
    id: 11,
    element: <FormUpdate />,
    href: "/products/edit/:id",
    group: "sub",
  },
  {
    id: 12,
    element: <AddCategoryForm />,
    href: "/categories/add",
    group: "sub",
  },
  {
    id: 13,
    element: <CategoryDetails />,
    href: "/categories/:id",
    group: "sub",
  },
  {
    id: 14,
    element: <OrderDetailsPage />,
    href: "/orders/:id",
    group: "sub",
  },
  {
    id: 15,
    element: <InvoiceDetails />,
    href: "/client/:id",
    group: "sub",
  },
];


export const sections = [
  {
    id: 1,
    title: "التسويق",
    icon: HeartHandshake,
    items: [
      { id: 11, href: "/clients", title: "العملاء", icon: User },
            { id: 23, href: "/coupons", title: "الخصومات", icon: BadgePercent },
      { id: 13, href: "/ads", title: "الإعلانات", icon: FileText },
    ],
  },
  {
    id: 2,
    title: "المبيعات",
    icon: ShoppingBag,
    items: [
      { id: 12, href: "/orders", title: "الطلبات", icon: FileText },
      { id: 21, href: "/products", title: "المنتجات", icon: ShoppingBag },
      { id: 22, href: "/categories", title: "الفئات", icon: Layers },


    ],
  },
  {
    id: 3,
    title: "الإعدادات",
    icon: Settings,
    items: [
      { id: 55, href: "/profile", title: "البروفايل", icon: User },
      { id: 31, href: "/governorates", title: "المحافظات", icon: MapPinHouse },
      { id: 32, href: "/contactInfo", title: "معلومات التواصل", icon: SmartphoneNfc },
      { id: 33, href: "/terms_and_conditions", title: "الشروط والأحكام", icon: FileText },
    ],
  },
  {
    id: 4,
    title: "التقارير",
    icon: ReceiptPoundSterling,
    items: [
      { id: 63, href: "/reports", title: "تقارير", icon: ReceiptPoundSterling },
      
    
    ],
  },
];