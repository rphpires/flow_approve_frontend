import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AtividadesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">Atividades</h1>
        <Button>Nova Atividade</Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data Início</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data Fim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">Manutenção Elétrica</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Empresa Exemplo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">01/04/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">10/04/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Em andamento
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                  <Button variant="outline" size="sm" className="mr-2">Detalhes</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">Cancelar</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}