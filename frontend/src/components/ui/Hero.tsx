import React from 'react';
import { Button } from './ButtonHome';

export function Hero() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Gerenciamento de Manutenção Inteligente
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Otimize suas operações de manutenção com nossa plataforma completa.
        Gerencie peças, equipes e máquinas em um único lugar.
      </p>
      <div className="flex gap-4 justify-center">
        <Button to="/login">Fazer Login</Button>
        <Button to="/signup" variant="secondary">Criar Conta</Button>
      </div>
    </div>
  );
}