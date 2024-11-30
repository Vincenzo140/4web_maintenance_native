import React from 'react';
import { Settings, Users, Wrench } from 'lucide-react';
import { Hero } from '../components/ui/Hero';
import { FeatureCard } from '../components/ui/FeatureCard';

export function LandingPage() {
  const features = [
    {
      icon: Wrench,
      title: 'Gestão de Peças',
      description: 'Controle seu inventário de peças com facilidade. Rastreie estoque, custos e manutenções preventivas.'
    },
    {
      icon: Users,
      title: 'Gestão de Equipes',
      description: 'Organize suas equipes de manutenção, atribua tarefas e acompanhe a produtividade.'
    },
    {
      icon: Settings,
      title: 'Gestão de Máquinas',
      description: 'Monitore o estado das máquinas, programe manutenções e evite paradas não planejadas.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <Hero />
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}