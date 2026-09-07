import React, {useMemo, useState, useRef} from 'react';
import type {Task, TaskStatus} from './dataGenerator';
import {formatDueText} from './utils';

const columns: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];

interface KanbanViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  collaborators: Record<string, string[]>;
}

export function KanbanView({tasks, onStatusChange, collaborators}: KanbanViewProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);
  const dragClone = useRef<HTMLDivElement | null>(null);

  const bucketed = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { 'To Do': [], 'In Progress': [], 'In Review': [], Done: [] };
    tasks.forEach((task) => map[task.status].push(task));
    return map;
  }, [tasks]);

  function startDrag(taskId: string) {
    setDragging(taskId);
  }

  function endDrag() {
    setDragging(null);
    setOverStatus(null);
  }

  function handleDrop(targetStatus: TaskStatus) {
    if (dragging) {
      onStatusChange(dragging, targetStatus);
    }
    endDrag();
  }

  return (
    <div style={{padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, height: 'calc(100vh - 165px)', overflow: 'hidden'}}>
      {columns.map((col) => (
        <div
          key={col}
          onDragOver={(e) => { e.preventDefault(); setOverStatus(col); }}
          onDrop={() => handleDrop(col)}
          style={{background: overStatus === col ? '#e8f7ff' : '#f8f9fa', border: '1px solid #ddd', borderRadius: 8, padding: 8, overflowY: 'auto'}}
        >
          <h3 style={{margin: '4px 0', fontSize: 15}}>{col}</h3>
          {bucketed[col].length === 0 ? <p style={{opacity: 0.6, fontStyle: 'italic'}}>No tasks</p> : null}
          {bucketed[col].map((task) => {
            const isDragging = dragging === task.id;
            return (
              <div
                key={task.id}
                draggable
                onDragStart={() => startDrag(task.id)}
                onDragEnd={endDrag}
                style={{
                  background: isDragging ? '#fff8e1' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  padding: 8,
                  marginBottom: 8,
                  opacity: isDragging ? 0.6 : 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,.08)',
                  cursor: 'grab',
                  transition: 'transform .2s ease-in-out',
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <strong>{task.title}</strong>
                  <span style={{fontSize: 11, color: '#666'}}>{task.priority}</span>
                </div>
                <div style={{marginTop: 4, fontSize: 12}}>{task.assignee}</div>
                <div style={{marginTop: 4, fontSize: 12, color: '#444'}}>{formatDueText(task.dueDate)}</div>
                <div style={{marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap'}}>
                  {collaborators[task.id]?.map((av) => (
                    <span key={`${task.id}-${av}`} style={{width: 18, height: 18, borderRadius: 999, background: av, display: 'inline-block'}} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
