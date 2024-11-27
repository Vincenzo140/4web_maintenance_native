import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-gray-600 text-sm font-medium">Hora Atual</p>
        <p className="text-3xl font-bold text-gray-800">
          {time.toLocaleTimeString('pt-BR')}
        </p>
        <p className="text-sm text-gray-500">
          {time.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      <div className="p-3 rounded-full bg-blue-50">
        <ClockIcon className="h-6 w-6 text-blue-500" />
      </div>
    </div>
  );
}