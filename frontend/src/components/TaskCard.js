import React, { useState } from "react";

export default function TaskCard({ task, onMove, onEdit, onDelete, allowMoveTo = [] }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");

  const save = () => {
    if (!title.trim()) return alert("Título obrigatório");
    onEdit(task, title, desc, task.status);
    setEditing(false);
  };

  return (
    <div className="card">
      {!editing ? (
        <>
          <h3>{task.title}</h3>
          {task.description && <p className="desc">{task.description}</p>}
          <div className="card-actions">
            {allowMoveTo.map(s => (
              <button key={s} onClick={() => onMove(task, s)}>Mover → {s === "in_progress" ? "Em Progresso" : s === "done" ? "Concluídas" : "A Fazer"}</button>
            ))}
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={() => onDelete(task)}>Excluir</button>
          </div>
        </>
      ) : (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="card-actions">
            <button onClick={save}>Salvar</button>
            <button onClick={() => { setEditing(false); setTitle(task.title); setDesc(task.description || ""); }}>Cancelar</button>
          </div>
        </>
      )}
    </div>
  );
}
