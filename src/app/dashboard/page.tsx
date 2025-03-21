import Card from "@/components/ui/Card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50 border-primary-200">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-primary-700">Empresas</h3>
            <p className="text-3xl font-bold text-primary-800 mt-2">0</p>
          </div>
        </Card>
        
        <Card className="bg-neutral-50 border-neutral-200">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-neutral-700">Usuários</h3>
            <p className="text-3xl font-bold text-neutral-800 mt-2">0</p>
          </div>
        </Card>
        
        <Card className="bg-primary-50 border-primary-200">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-primary-700">Documentos</h3>
            <p className="text-3xl font-bold text-primary-800 mt-2">0</p>
          </div>
        </Card>
        
        <Card className="bg-neutral-50 border-neutral-200">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-neutral-700">Atividades</h3>
            <p className="text-3xl font-bold text-neutral-800 mt-2">0</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Documentos Pendentes">
          <p className="text-neutral-600">Não há documentos pendentes de aprovação.</p>
        </Card>
        
        <Card title="Atividades Recentes">
          <p className="text-neutral-600">Não há atividades recentes.</p>
        </Card>
      </div>
    </div>
  );
}