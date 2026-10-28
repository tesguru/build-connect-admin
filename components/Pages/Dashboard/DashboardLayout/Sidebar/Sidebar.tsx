"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  Gavel,
  Building2,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { BuildConnectLogo } from "@/libs/constants/image";
import { URLS } from "@/libs/constants/pageurl";
import { useAuth } from "@/libs/hooks/useAuth";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active?: boolean;
  hasSubmenu?: boolean;
  href?: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
}

interface SidebarProps {
  activePath?: string;
}

export const Sidebar = ({ activePath }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};
    
    menuItems.forEach(item => {
      if (item.hasSubmenu && item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => 
          activePath === subItem.href || activePath?.startsWith(subItem.href)
        );
        
        if (hasActiveSubItem) {
          newExpandedItems[item.id] = true;
        }
      }
    });
    
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
  }, [activePath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const menuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: URLS.DASHBOARD.DASHBOARD,
      active: activePath === URLS.DASHBOARD.DASHBOARD
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      href: URLS.DASHBOARD.USERS,
      active: activePath === URLS.DASHBOARD.USERS
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: Briefcase, 
      href: URLS.DASHBOARD.PROJECTS,
      active: activePath === URLS.DASHBOARD.PROJECTS
    },
    { 
      id: 'bids', 
      label: 'Bids & EOI', 
      icon: Gavel, 
      href: URLS.DASHBOARD.BID,
      active: activePath === URLS.DASHBOARD.BID
    },
    { 
      id: 'properties', 
      label: 'Properties', 
      icon: Building2, 
      href: URLS.DASHBOARD.PROPERTIES,
      active: activePath === URLS.DASHBOARD.PROPERTIES
    },
    { 
      id: 'escrow', 
      label: 'Escrow', 
      icon: CreditCard, 
      href: URLS.DASHBOARD.ESCROW,
      active: activePath === URLS.DASHBOARD.ESCROW
    },
     { 
      id: 'mortgage', 
      label: 'Mortgage', 
      icon: CreditCard, 
      href: URLS.DASHBOARD.MORTGAGE,
      active: activePath === URLS.DASHBOARD.MORTGAGE
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: FileText, 
      href: URLS.DASHBOARD.DOCUMENTS,
      active: activePath === URLS.DASHBOARD.DOCUMENTS
    },
    { 
      id: 'support', 
      label: 'Support', 
      icon: MessageSquare, 
      href: URLS.DASHBOARD.SUPPORT || '/dashboard/support',
      active: activePath === (URLS.DASHBOARD.SUPPORT || '/dashboard/support')
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      href: URLS.DASHBOARD.SETTINGS || '/dashboard/settings',
      active: activePath === (URLS.DASHBOARD.SETTINGS || '/dashboard/settings')
    },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
   const { logout } = useAuth();
  const handleLogout = () => {
    setIsMobileOpen(false);
    logout();
  };

  return (
    <>
  
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

 
      <div
        id="sidebar"
        className={`
          fixed md:relative z-40 w-64 bg-white h-screen border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      
        <div className=" border-b border-gray-200 flex">
          <div className="flex items-center ">
            <Image 
              src={BuildConnectLogo} 
              alt="Ivantage Logo" 
              width={180}
              height={40}
              priority
            />
          </div>
      
        </div>

       
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.href && !item.hasSubmenu ? (
                  <Link 
                    href={item.href} 
                    onClick={() => setIsMobileOpen(false)}
                    passHref
                  >
                    <div
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        item.active
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        item.active
                          ? 'bg-primary-01 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      aria-expanded={expandedItems[item.id]}
                      aria-controls={`submenu-${item.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.hasSubmenu && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            expandedItems[item.id] ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {item.hasSubmenu && expandedItems[item.id] && (
                      <div 
                        id={`submenu-${item.id}`}
                        className="ml-6 mt-2 space-y-1"
                        aria-label={`${item.label} submenu`}
                      >
                        {item.subItems?.map((subItem) => (
                          <Link 
                            key={subItem.id} 
                            href={subItem.href}
                            onClick={() => setIsMobileOpen(false)}
                            passHref
                          >
                            <div
                              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                activePath === subItem.href || activePath?.startsWith(subItem.href)
                                  ? 'bg-primary-03 text-black font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {subItem.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};