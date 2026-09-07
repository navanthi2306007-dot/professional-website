export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  startDate: string; // ISO
  dueDate: string; // ISO
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
const assignees = ['Ava', 'Noah', 'Mia', 'Liam', 'Emma', 'Oliver'];
const titles = [
  'Design homepage',
  'Integrate payment API',
  'Fix login bug',
  'Write e2e tests',
  'Plan release',
  'Optimize DB queries',
  'Run security audit',
  'Improve search UX',
  'Add analytics',
  'Refactor dashboard',
];

const random = (max: number) => Math.floor(Math.random() * max);

export function generateTasks(count = 550): Task[] {
  const now = new Date();
  const tasks: Task[] = [];

  for (let i = 1; i <= count; i += 1) {
    const status = statuses[random(statuses.length)];
    const priority = priorities[random(priorities.length)];
    const assignee = assignees[random(assignees.length)];
    const title = `${titles[random(titles.length)]} ${i}`;

    const start = new Date(now);
    start.setDate(now.getDate() - random(7) + random(14));
    const due = new Date(start);
    due.setDate(start.getDate() + 1 + random(21));

    tasks.push({
      id: `task-${i}`,
      title,
      description: `Detailed steps for ${title}`,
      status,
      priority,
      assignee,
      startDate: start.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
    });
  }
  return tasks;
}

export interface SimUser {
  id: string;
  name: string;
  color: string;
  taskId: string;
}

export function generateSimUsers(tasks: Task[], n = 6): SimUser[] {
  return Array.from({ length: n }, (_, index) => ({
    id: `user-${index + 1}`,
    name: ['Sam', 'Ariel', 'Vik', 'Jo', 'Eve', 'Max'][index % 6],
    color: ['#ff6b6b', '#54a0ff', '#00d2d3', '#feca57', '#5f27cd', '#1dd1a1'][index % 6],
    taskId: tasks[Math.floor(Math.random() * tasks.length)]?.id ?? '',
  }));
}
