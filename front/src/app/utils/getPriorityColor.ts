export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'LOW':
      return 'blue';
    case 'MEDIUM':
      return 'orange';
    case 'HIGH':
      return 'red';
    case 'CRITICAL':
      return 'purple';
    default:
      return 'default';
  }
};
