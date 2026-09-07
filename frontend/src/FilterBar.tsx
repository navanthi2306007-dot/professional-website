import React from 'react';
import type {TaskPriority, TaskStatus} from './dataGenerator';

export interface FilterState {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  assignees: string[];
  startDate: string;
  endDate: string;
}

interface FilterBarProps {
  filter: FilterState;
  setFilter: (next: FilterState) => void;
  allAssignees: string[];
}

const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

function toggle<T extends string>(array: T[], value: T): T[] {
  if (array.includes(value)) return array.filter((v) => v !== value);
  return [...array, value];
}

export function FilterBar({filter, setFilter, allAssignees}: FilterBarProps) {
  return (
    <div style={{borderBottom: '1px solid #ddd', padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, background: '#fafafa'}}>
      <div>
        <strong>Status</strong>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4}}>
          {statusOptions.map((item) => (
            <button
              key={item}
              onClick={() => setFilter({...filter, statuses: toggle(filter.statuses, item)})}
              style={{padding: '4px 9px', borderRadius: 4, border: filter.statuses.includes(item) ? '1px solid #333' : '1px solid #bbb', background: filter.statuses.includes(item) ? '#333' : '#fff', color: filter.statuses.includes(item) ? '#fff' : '#333'}}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <strong>Priority</strong>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4}}>
          {priorityOptions.map((item) => (
            <button
              key={item}
              onClick={() => setFilter({...filter, priorities: toggle(filter.priorities, item)})}
              style={{padding: '4px 9px', borderRadius: 4, border: filter.priorities.includes(item) ? '1px solid #333' : '1px solid #bbb', background: filter.priorities.includes(item) ? '#333' : '#fff', color: filter.priorities.includes(item) ? '#fff' : '#333'}}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <strong>Assignee</strong>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4}}>
          {allAssignees.map((item) => (
            <button
              key={item}
              onClick={() => setFilter({...filter, assignees: toggle(filter.assignees, item)})}
              style={{padding: '4px 9px', borderRadius: 4, border: filter.assignees.includes(item) ? '1px solid #333' : '1px solid #bbb', background: filter.assignees.includes(item) ? '#333' : '#fff', color: filter.assignees.includes(item) ? '#fff' : '#333'}}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column'}}>
        <strong>Date range</strong>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4}}>
          <input type="date" value={filter.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({...filter, startDate: e.target.value})} />
          <input type="date" value={filter.endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({...filter, endDate: e.target.value})} />
        </div>
      </div>

      <button
        onClick={() => setFilter({statuses: [], priorities: [], assignees: [], startDate: '', endDate: ''})}
        style={{padding: '6px 10px', borderRadius: 4, background: '#00a8ff', color: '#fff', border: 'none', width: '100%', minWidth: 120}}
      >
        Clear filters
      </button>
    </div>
  );
}
