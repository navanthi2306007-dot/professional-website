export function formatDueText(isoDate: string) {
  const due = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Due Today';
  if (diff > 0) return `Due in ${diff} day${diff === 1 ? '' : 's'}`;
  if (diff < -7) return `${Math.abs(diff)} days overdue`;
  return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} overdue`;
}
