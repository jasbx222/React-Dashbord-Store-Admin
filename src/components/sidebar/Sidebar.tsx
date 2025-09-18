import { Menu, X, ChevronDown, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sections } from "../../routers";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<any>({});

  useEffect(() => {
    if (window.innerWidth >= 1024) setOpen(true);
    else setOpen(false);
  }, []);

  const toggleDropdown = (id: any) => {
    setOpenDropdowns((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {/* زر القائمة للموبايل */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-60 p-3 rounded-full bg-[#4329fc] text-white shadow-lg hover:scale-110 transition-transform duration-300 lg:hidden"
      >
        <Menu size={26} />
      </button>

      {/* Overlay خلفية */}
      <AnimatePresence>
        {open && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        dir="rtl"
        initial={{ x: window.innerWidth >= 1024 ? 0 : "100%" }}
        animate={{ x: open ? 0 : window.innerWidth >= 1024 ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="fixed top-0 h-screen right-0 w-72 bg-white text-[#4329fc] flex flex-col justify-between py-8 shadow-2xl overflow-auto z-60 rounded-tl-3xl rounded-bl-3xl
                   lg:translate-x-0 lg:static lg:shadow-none transform transition-transform duration-300"
      >
        {/* زر الإغلاق للموبايل */}
        <button
          onClick={() => setOpen(false)}
          className="absolute z-70 top-4 left-4 text-[#4329fc]/80 hover:text-[#4329fc] transition lg:hidden"
        >
          <X size={24} />
        </button>

        {/* اللوغو */}
        <div className="flex justify-center items-center mb-8 mt-6">
          <div className="bg-white rounded-full p-3 flex items-center justify-center shadow-md">
          
          </div>
        </div>

        {/* القائمة */}
        <div className="px-6 relative z-50 flex-1">
          <nav className="space-y-3">
            <NavLink
              to={"/home"}
              className={({ isActive }) =>
                `group flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-300
                          ${
                            isActive
                              ? "bg-[#4329fc]/20 text-[#4329fc] font-semibold"
                              : "hover:bg-[#4329fc]/10 text-[#4329fc]/80"
                          }`
              }
              onClick={() => setOpen(false)}
            >
              <Home />
              الصفحة الرئيسية
            </NavLink>
            {sections.map(({ id, title, icon: Icon, items }) => (
              <div key={id}>
                <button
                  onClick={() => toggleDropdown(id)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-[#4329fc]/5 text-[#4329fc]/80"
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={20} />}
                    <span className="tracking-wide">{title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: openDropdowns[id] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {openDropdowns[id] && (
                  <div className="ml-6 mt-1 flex flex-col space-y-1">
                    {items.map(({ id, title, href, icon: ItemIcon }) => (
                      <NavLink
                        key={id}
                        to={href}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-300
                          ${
                            isActive
                              ? "bg-[#4329fc]/20 text-[#4329fc] font-semibold"
                              : "hover:bg-[#4329fc]/10 text-[#4329fc]/80"
                          }`
                        }
                        onClick={() => setOpen(false)}
                      >
                        {ItemIcon && <ItemIcon size={16} />}
                        {title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </motion.aside>
    </div>
  );
}
