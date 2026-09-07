import React, {useMemo} from 'react';
import type {Task} from './dataGenerator';
import {formatDueText} from './utils';

interface TimelineViewProps {
  tasks: Task[];
}

function parseDate(value: string) {
  const date = new Date(value);
  return date.getTime();
}

export function TimelineView({tasks}: TimelineViewProps) {
  const base = useMemo(() => {
    if (tasks.length === 0) return {min: Date.now(), max: Date.now() + 1};
    const dates = tasks.flatMap((t) => [parseDate(t.startDate), parseDate(t.dueDate)]);
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    return {min, max};
  }, [tasks]);

  const span = Math.max(base.max - base.min, 1);

  return (
    <div style={{padding: 14, height: 'calc(100vh - 165px)', overflowY: 'auto', background: '#fafafa'}}>
      <div style={{position: 'relative', border: '1px solid #ddd', background: '#fff', minHeight: 360, padding: 10}}>
        <div style={{position: 'absolute', inset: '10px 10px 10px 10px', borderTop: '1px dashed #ccc'}}></div>
        {tasks.map((task, idx) => {
          const left = ((parseDate(task.startDate) - base.min) / span) * 100;
          const right = ((parseDate(task.dueDate) - base.min) / span) * 100;
          return (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: 30 * (idx % 10),
                width: `${Math.max(3, right - left)}%`,
                background: task.status === 'Done' ? '#94d82d' : '#339af0',
                borderRadius: 4,
                color: '#fff',
                padding: '4px 6px',
                boxSizing: 'border-box',
              }}
              title={`${task.title} (${task.startDate} → ${task.dueDate})`}
            >
              <div style={{fontSize: 12, fontWeight: 600}}>{task.title}</div>
              <div style={{fontSize: 11}}>{formatDueText(task.dueDate)}</div>
            </div>
          );
        })}
      </div>
      {tasks.length === 0 ? <div style={{padding: 12, color: '#777'}}>No timeline data available</div> : null}
    </div>
  );
}
