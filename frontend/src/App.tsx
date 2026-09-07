import React, {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {KanbanView} from './KanbanView';
import {ListView} from './ListView';
import {TimelineView} from './TimelineView';
import {FilterBar, FilterState} from './FilterBar';
import {CollaborationBar} from './CollaborationBar';
import {generateTasks, generateSimUsers, type SimUser, type Task} from './dataGenerator';

const initialTasks = generateTasks(580);

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [simUsers, setSimUsers] = useState<SimUser[]>(generateSimUsers(initialTasks, 6));
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter: FilterState = {
    statuses: [],
    priorities: [],
    assignees: [],
    startDate: '',
    endDate: '',
  };

  const [filter, setFilter] = useState<FilterState>(initialFilter);

  useEffect(() => {
    const fromQS = {
      statuses: searchParams.get('status')?.split(',').filter(Boolean) as FilterState['statuses'] || [],
      priorities: searchParams.get('priority')?.split(',').filter(Boolean) as FilterState['priorities'] || [],
      assignees: searchParams.get('assignee')?.split(',').filter(Boolean) || [],
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    };
    setFilter(fromQS);
    const qpView = searchParams.get('view');
    if (qpView === 'kanban' || qpView === 'list' || qpView === 'timeline') setView(qpView);
  }, []);

  useEffect(() => {
    const qp: Record<string, string> = {};
    if (filter.statuses.length) qp.status = filter.statuses.join(',');
    if (filter.priorities.length) qp.priority = filter.priorities.join(',');
    if (filter.assignees.length) qp.assignee = filter.assignees.join(',');
    if (filter.startDate) qp.startDate = filter.startDate;
    if (filter.endDate) qp.endDate = filter.endDate;
    qp.view = view;
    setSearchParams(qp);
  }, [filter, view, setSearchParams]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter.statuses.length && !filter.statuses.includes(task.status)) return false;
      if (filter.priorities.length && !filter.priorities.includes(task.priority)) return false;
      if (filter.assignees.length && !filter.assignees.includes(task.assignee)) return false;
      if (filter.startDate && task.startDate < filter.startDate) return false;
      if (filter.endDate && task.dueDate > filter.endDate) return false;
      return true;
    });
  }, [tasks, filter]);

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee)));

  useEffect(() => {
    const timer = setInterval(() => {
      setSimUsers((prev) => {
        if (!tasks.length) return prev;
        const copy = [...prev];
        const idx = Math.floor(Math.random() * copy.length);
        const pickTask = tasks[Math.floor(Math.random() * tasks.length)];
        copy[idx] = {...copy[idx], taskId: pickTask.id};
        return copy;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [tasks]);

  const collaborators: Record<string, string[]> = {};
  simUsers.forEach((u) => {
    if (!u.taskId) return;
    collaborators[u.taskId] = [...(collaborators[u.taskId] || []), u.color];
  });

  const onStatusChange = (taskId: string, status: Task['status']) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? {...task, status} : task)));
  };

  return (
    <div style={{fontFamily: 'Segoe UI, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', color: '#222'}}>
      <div style={{background: '#1e90ff', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{margin: 0, fontSize: 18}}>Multi-view Project Tracker</h1>
        <div style={{display: 'flex', gap: 8}}>
          {['kanban', 'list', 'timeline'].map((v) => (
            <button key={v} onClick={() => setView(v as typeof view)} style={{padding: '6px 10px', borderRadius: 4, border: 'none', cursor: 'pointer', background: view === v ? '#fff' : '#3ba0ff', color: view === v ? '#1e90ff' : '#fff'}}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <CollaborationBar users={simUsers} />
      <FilterBar filter={filter} setFilter={setFilter} allAssignees={assignees} />
      <div style={{flex: 1}}>
        {view === 'kanban' && <KanbanView tasks={filteredTasks} onStatusChange={onStatusChange} collaborators={collaborators} />}
        {view === 'list' && <ListView tasks={filteredTasks} onStatusChange={onStatusChange} />}
        {view === 'timeline' && <TimelineView tasks={filteredTasks} />}
      </div>
    </div>
  );
}
