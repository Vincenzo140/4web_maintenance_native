import { Machine } from '../types';

export const filterMachinesByStatus = (machines: Machine[], filter: string): Machine[] => {
  switch (filter) {
    case "Todos":
      return machines;
    case "Em Manutenção":
      return machines.filter((machine) => machine.status === "maintenance");
    case "Operacional":
      return machines.filter((machine) => machine.status === "operational");
    case "Quebrada":
      return machines.filter((machine) => machine.status === "broken");
    case "Desativada":
      return machines.filter((machine) => machine.status === "retired");
    default:
      return machines;
  }
};