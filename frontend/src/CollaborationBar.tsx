import React from 'react';
import type {SimUser} from './dataGenerator';

interface CollaborationBarProps {
  users: SimUser[];
}

export function CollaborationBar({users}: CollaborationBarProps) {
  return (
    <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ececec', background: '#fff'}}>
      <strong style={{marginRight: 12}}>Live collaborators:</strong>
      <div style={{display: 'flex', gap: '8px'}}>
        {users.map((user) => (
          <div key={user.id} title={`${user.name}: ${user.taskId}`} style={{display: 'flex', alignItems: 'center', gap: 6, opacity: 0.95, animation: 'bob 3s ease-in-out infinite'}}>
            <span style={{width: 24, height: 24, borderRadius: 999, background: user.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12}}>{user.name[0]}</span>
            <span style={{fontSize: 13}}>{user.name}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bob { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-2px);} }
      `}</style>
    </div>
  );
}
