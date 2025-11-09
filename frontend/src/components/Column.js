import React from "react";
import TaskCard from "./TaskCard";

export default function Column({ title, tasks, onMove, onEdit, onDelete, allowMoveTo = [] }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {tasks.length === 0 && <div className="empty">Sem tarefas</div>}
      {tasks.map(t => (
        <TaskCard key={t.id} task={t} onMove={onMove} onEdit={onEdit} onDelete={onDelete} allowMoveTo={allowMoveTo} />
      ))}
    </div>
  );
}
