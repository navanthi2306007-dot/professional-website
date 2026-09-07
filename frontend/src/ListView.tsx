import React, {useEffect, useMemo, useRef, useState} from 'react';
import type {Task} from './dataGenerator';
import {formatDueText} from './utils';

interface ListViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const ROW_HEIGHT = 72;
const BUFFER = 7;

export function ListView({tasks, onStatusChange}: ListViewProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const TotalHeight = tasks.length * ROW_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(tasks.length, Math.ceil((scrollTop + 600) / ROW_HEIGHT) + BUFFER);
  const visibleTasks = useMemo(() => tasks.slice(startIndex, endIndex), [tasks, startIndex, endIndex]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handle = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', handle);
    return () => el.removeEventListener('scroll', handle);
  }, []);

  const rowOffset = startIndex * ROW_HEIGHT;

  return (
    <div style={{height: 'calc(100vh - 170px)', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '8px 12px', background: '#f3f5f8', borderBottom: '1px solid #ddd'}}>
        <strong>Tasks ({tasks.length})</strong>
      </div>
      {tasks.length === 0 ? (
        <div style={{flex: 1, display: 'grid', placeItems: 'center', color: '#777'}}>No tasks found for current filters</div>
      ) : (
        <div ref={viewportRef} style={{overflowY: 'auto', height: '100%'}}>
          <div style={{position: 'relative', height: TotalHeight}}>
            <div style={{transform: `translateY(${rowOffset}px)`}}>
              {visibleTasks.map((task) => (
                <div key={task.id} style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center', background: '#fff', borderBottom: '1px solid #eee', height: ROW_HEIGHT - 2, padding: '8px 10px'}}>
                  <div>
                    <strong>{task.title}</strong>
                    <div style={{fontSize: 12, color: '#555'}}>{task.description}</div>
                  </div>
                  <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>In Review</option>
                    <option>Done</option>
                  </select>
                  <span>{task.assignee}</span>
                  <span>{task.priority}</span>
                  <span>{formatDueText(task.dueDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
