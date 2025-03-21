"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaBuilding, 
  FaUsers, 
  FaFileAlt, 
  FaTasks,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";

interface SubItem {
  label: string;
  href: string;
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  subItems?: SubItem[];
  isActive: boolean;
}

const MenuItem = ({ icon, label, href, subItems = [], isActive }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const hasSubItems = subItems.length > 0;

  return (
    <div>
      <div 
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={() => hasSubItems && setIsOpen(!isOpen)}
      >
        {icon}
        <span className="ml-3">{label}</span>
        {hasSubItems && (
          <span className="ml-auto">
            {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        )}
      </div>
      
      {isOpen && hasSubItems && (
        <div className="mt-1">
          {subItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className="sidebar-subitem">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    {
      icon: <FaBuilding size={18} />,
      label: "Empresas",
      href: "/dashboard/empresas",
      subItems: [
        { label: "Listar Empresas", href: "/dashboard/empresas" }
      ]
    },
    {
      icon: <FaUsers size={18} />,
      label: "Usuários",
      href: "/dashboard/usuarios",
      subItems: [
        { label: "Listar Usuários", href: "/dashboard/usuarios" }
      ]
    },
    {
      icon: <FaFileAlt size={18} />,
      label: "Documentos",
      href: "/dashboard/documentos",
      subItems: [
        { label: "Listar Documentos", href: "/dashboard/documentos" }
      ]
    },
    {
      icon: <FaTasks size={18} />,
      label: "Atividades",
      href: "/dashboard/atividades",
      subItems: [
        { label: "Listar Atividades", href: "/dashboard/atividades" }
      ]
    }
  ];

  return (
    <aside className="bg-white border-r border-neutral-200 w-64 min-h-screen p-4">
      <div className="flex items-center justify-center py-4 mb-6">
        <h2 className="text-xl font-bold text-primary-600">DocTrab</h2>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <MenuItem 
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            subItems={item.subItems}
            isActive={pathname?.includes(item.href) || false}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;