import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Teams() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipes</h1>
        <p className="text-muted-foreground">
          Gerenciamento de equipes de manutenção
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta funcionalidade estará disponível em breve.</p>
        </CardContent>
      </Card>
    </div>
  );
}