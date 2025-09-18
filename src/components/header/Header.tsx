// import { useState } from "react";
// import { Bell, Plus, X } from "lucide-react";

// interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
// }

// export default function HeaderWithNotifications() {
//   const [notifications, setNotifications] = useState<Notification[]>([
//     { id: 1, title: "رحلة جديدة", message: "تم إضافة رحلة جديدة إلى النظام", date: "21-08-2025", read: false },
//     { id: 2, title: "تذكير دفع", message: "لم يتم دفع حجزك الأخير", date: "20-08-2025", read: true },
//   ]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [newNotification, setNewNotification] = useState({ title: "", message: "" });
 
//   const unreadCount = notifications.filter(n => !n.read).length;

//   const handleAddNotification = () => {
//     const nextId = notifications.length + 1;
//     setNotifications([{ ...newNotification, id: nextId, date: new Date().toLocaleDateString(), read: false }, ...notifications]);
//     setNewNotification({ title: "", message: "" });
//     setModalOpen(false);
//   };

//   const markAsRead = (id: number) => {
//     setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
//   };

//   return (
//   <></>
//   );
// }
