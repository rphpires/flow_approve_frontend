"use client";

import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-medium text-neutral-800">Controle de Documentos Trabalhistas</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;