import { colors } from '../theme';

export const translateStatus = (status: string): string => {
  switch (status) {
    case "operational":
      return "Operacional";
    case "maintenance":
      return "Em Manutenção";
    case "broken":
      return "Quebrada";
    case "retired":
      return "Desativada";
    default:
      return "Desconhecido";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'operacional':
      return colors.status.operational;
    case 'em manutenção':
      return colors.status.maintenance;
    case 'quebrada':
      return colors.status.broken;
    case 'desativada':
      return colors.status.retired;
    default:
      return colors.text.disabled;
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'alta':
      return colors.status.broken;
    case 'média':
      return colors.status.maintenance;
    case 'baixa':
      return colors.status.operational;
    default:
      return colors.text.disabled;
  }
};