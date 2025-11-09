import React, { useState } from "react";

export default function NewTaskForm({ onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = e => {
    e.preventDefault();
    if (!title.trim()) return alert("Título obrigatório");
    onCreate(title, desc);
    setTitle(""); setDesc("");
  };

  return (
    <form onSubmit={submit} className="new-task-form">
      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Descrição (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar"}</button>
    </form>
  );
}
