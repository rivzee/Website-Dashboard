'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Briefcase,
  ShoppingCart,
  FileText,
  LogOut,
  Menu,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  user: any;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

// Custom easing curves untuk animasi yang lebih smooth
const smoothEase = [0.25, 0.1, 0.25, 1] as const;
const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 0.8
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: smoothEase
    }
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: smoothEase
    }
  },
  active: {
    scale: 1.05,
    transition: springConfig
  }
};

const labelVariants = {
  collapsed: {
    opacity: 0,
    x: -20,
    width: 0,
    transition: {
      duration: 0.3,
      ease: smoothEase
    }
  },
  expanded: {
    opacity: 1,
    x: 0,
    width: 'auto',
    transition: {
      duration: 0.4,
      ease: smoothEase,
      delay: 0.1
    }
  }
};

export default function Sidebar({ user, isDarkMode = false, toggleDarkMode, isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!user) return null;

  const menuItems = {
    ADMIN: [
      { icon: Home, label: 'Beranda', href: '/dashboard/admin' },
      { icon: FileText, label: 'Manajemen Pesanan', href: '/dashboard/admin/orders' },
      { icon: Users, label: 'Kelola Akun', href: '/dashboard/users' },
      { icon: Briefcase, label: 'Kelola Layanan', href: '/dashboard/services' },
      { icon: DollarSign, label: 'Pembayaran', href: '/dashboard/payments' },
      { icon: Clock, label: 'Riwayat Aktivitas', href: '/dashboard/activity' },
    ],
    AKUNTAN: [
      { icon: Home, label: 'Beranda', href: '/dashboard/akuntan' },
      { icon: Briefcase, label: 'Daftar Pekerjaan', href: '/dashboard/akuntan/jobs' },
    ],
    KLIEN: [
      { icon: Home, label: 'Beranda', href: '/dashboard/klien' },
      { icon: Briefcase, label: 'Layanan', href: '/dashboard/order' },
      { icon: ShoppingCart, label: 'Pesanan Saya', href: '/dashboard/my-orders' },
    ],
  };

  let role = user.role ? user.role.toUpperCase() : '';
  if (role === 'ACCOUNTANT') role = 'AKUNTAN';
  if (role === 'CLIENT') role = 'KLIEN';

  const currentMenuItems = menuItems[role as keyof typeof menuItems] || [];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          color: isDarkMode ? '#FFFFFF' : '#1F2937',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="md:hidden fixed top-4 left-4 z-50 p-3 backdrop-blur-md rounded-xl shadow-lg border"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '288px',
          x: isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -300,
          backgroundColor: isDarkMode ? '#0B1120' : '#FFFFFF',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
        }}
        transition={{
          duration: 0.5,
          ease: smoothEase,
          width: { duration: 0.4, ease: smoothEase },
          backgroundColor: { duration: 0.6, ease: smoothEase },
          borderColor: { duration: 0.6, ease: smoothEase }
        }}
        className={`fixed left-0 top-0 h-screen border-r shadow-2xl z-40 flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-800'
          } ${isOpen ? 'block' : 'hidden md:flex'}`}
      >
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: isDarkMode ? [0.1, 0.15, 0.1] : [0.05, 0.08, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -top-[20%] -left-[20%] w-80 h-80 rounded-full blur-[80px] ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-400/20'
              }`}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: isDarkMode ? [0.1, 0.12, 0.1] : [0.05, 0.07, 0.05]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className={`absolute top-[40%] -right-[20%] w-80 h-80 rounded-full blur-[80px] ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-400/20'
              }`}
          />
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: isDarkMode ? [0.1, 0.14, 0.1] : [0.05, 0.09, 0.05]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className={`absolute -bottom-[20%] left-[20%] w-80 h-80 rounded-full blur-[80px] ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-400/20'
              }`}
          />
        </div>

        {/* Header */}
        <div className="relative p-6 z-10">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: smoothEase }}
                    className="relative w-10 h-10 flex items-center justify-center"
                  >
                    <img
                      src="/logo-risabur.png"
                      alt="RISA BUR Logo"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                      RISA BUR
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className={`text-[10px] font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                    >
                      Kantor Jasa Akuntan
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              transition={{ duration: 0.3, ease: smoothEase }}
              className={`p-2 rounded-lg transition-all duration-300 ${isCollapsed
                ? isDarkMode
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isCollapsed ? 'expand' : 'collapse'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="sync">
            {currentMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Link href={item.href} className="block">
                    <motion.div
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      transition={{ duration: 0.2, ease: smoothEase }}
                      className={`relative flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                        ? isDarkMode ? 'text-white' : 'text-blue-600'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      {/* Active Background Pill with Glow */}
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 rounded-xl border ${isDarkMode
                              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30'
                              : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300/50'
                              }`}
                            initial={false}
                            transition={springConfig}
                          />
                          <motion.div
                            className={`absolute inset-0 rounded-xl blur-xl ${isDarkMode
                              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                              : 'bg-gradient-to-r from-blue-200/30 to-purple-200/30'
                              }`}
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                              scale: [0.95, 1.05, 0.95]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </>
                      )}

                      {/* Hover Background */}
                      {!isActive && isHovered && (
                        <motion.div
                          layoutId="hoverTab"
                          className={`absolute inset-0 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                            }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      {/* Icon with Animation */}
                      <motion.div
                        variants={iconVariants}
                        initial="rest"
                        whileHover="hover"
                        animate={isActive ? "active" : "rest"}
                        className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${isActive
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                          : isDarkMode
                            ? 'bg-white/5 group-hover:bg-white/10'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}
                      >
                        <Icon size={18} />
                      </motion.div>

                      {/* Label with Smooth Transition */}
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            variants={labelVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="relative z-10 font-medium text-sm whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Animated Hover Indicator */}
                      {!isActive && !isCollapsed && (
                        <motion.div
                          className={`absolute right-3 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-gray-400/50'
                            }`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      {/* Active Indicator Line */}
                      {isActive && !isCollapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-full"
                          initial={false}
                          transition={springConfig}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* Footer / Logout */}
        <div className={`p-4 border-t relative z-10 ${isDarkMode ? 'border-white/5' : 'border-gray-200'
          }`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} 
              group relative overflow-hidden rounded-xl p-3 transition-all duration-300 ${isCollapsed
                ? isDarkMode
                  ? 'bg-red-500/10 hover:bg-red-500/20'
                  : 'bg-red-50 hover:bg-red-100'
                : isDarkMode
                  ? 'hover:bg-red-500/10'
                  : 'hover:bg-red-50'
              }`}
            title={isCollapsed ? 'Keluar' : ''}
          >
            {/* Animated Gradient Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0"
              whileHover={{
                backgroundImage: isDarkMode
                  ? 'linear-gradient(to right, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0))'
                  : 'linear-gradient(to right, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02), rgba(220, 38, 38, 0))'
              }}
              transition={{ duration: 0.5 }}
            />

            <motion.div
              whileHover={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.5 }}
            >
              <LogOut
                size={20}
                className={`${isCollapsed
                  ? 'text-red-400'
                  : isDarkMode
                    ? 'text-gray-400 group-hover:text-red-400'
                    : 'text-gray-500 group-hover:text-red-500'
                  } transition-colors duration-300`}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className={`font-medium text-sm transition-colors duration-300 overflow-hidden whitespace-nowrap ${isDarkMode
                    ? 'text-gray-400 group-hover:text-red-400'
                    : 'text-gray-600 group-hover:text-red-500'
                    }`}
                >
                  Keluar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}