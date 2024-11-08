import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/Dashboard';
import { Machines } from '@/components/Machines';
import { Maintenances } from '@/components/Maintenances';
import { Parts } from '@/components/Parts';
import { Teams } from '@/components/Teams';
import { ThemeProvider } from '@/components/theme-provider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center space-x-4">
                <Settings className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Sistema de Manutenção</h2>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto py-6">
            <Dashboard />
            
            <Tabs defaultValue="machines" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="machines">Máquinas</TabsTrigger>
                <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
                <TabsTrigger value="parts">Peças</TabsTrigger>
                <TabsTrigger value="teams">Equipes</TabsTrigger>
              </TabsList>
              <TabsContent value="machines">
                <Machines />
              </TabsContent>
              <TabsContent value="maintenance">
                <Maintenances />
              </TabsContent>
              <TabsContent value="parts">
                <Parts />
              </TabsContent>
              <TabsContent value="teams">
                <Teams />
              </TabsContent>
            </Tabs>
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;