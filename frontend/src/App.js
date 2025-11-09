import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api";
import Column from "./components/Column";
import NewTaskForm from "./components/NewTaskForm";

const STATUS_TODO = "todo";
const STATUS_PROGRESS = "in_progress";
const STATUS_DONE = "done";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (title, description) => {
    setCreating(true);
    try {
      const t = await createTask({ title, description, status: STATUS_TODO });
      setTasks((prev) => [...prev, t]);
    } catch (e) {
      alert("Erro: " + e.message);
    } finally {
      setCreating(false);
    }
  };

  const onMove = async (task, newStatus) => {
    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (e) {
      alert("Erro ao mover: " + e.message);
    }
  };

  const onEdit = async (task, title, description, status) => {
    try {
      const updated = await updateTask(task.id, { title, description, status });
      setTasks((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (e) {
      alert("Erro ao editar: " + e.message);
    }
  };

  const onDelete = async (task) => {
    if (!window.confirm("Deletar essa tarefa?")) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((p) => p.id !== task.id));
    } catch (e) {
      alert("Erro ao deletar: " + e.message);
    }
  };

  const todo = tasks.filter((t) => t.status === STATUS_TODO);
  const progress = tasks.filter((t) => t.status === STATUS_PROGRESS);
  const done = tasks.filter((t) => t.status === STATUS_DONE);

  return (
    <div className="app">
      <header>
        <h1>Mini Kanban</h1>
        <button onClick={() => load()}>Atualizar</button>
      </header>

      {}
      <section className="create-top">
        <h3>Nova tarefa</h3>
        <NewTaskForm onCreate={onCreate} loading={creating} />
      </section>

      <main>
        {loading && <div className="feedback">Carregando...</div>}
        {error && <div className="feedback error">Erro: {error}</div>}

        <div className="board">
          <Column
            title="A Fazer"
            tasks={todo}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
            allowMoveTo={[STATUS_PROGRESS]}
          />
          <Column
            title="Em Progresso"
            tasks={progress}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
            allowMoveTo={[STATUS_TODO, STATUS_DONE]}
          />
          <Column
            title="Concluídas"
            tasks={done}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
            allowMoveTo={[STATUS_PROGRESS]}
          />
        </div>
      </main>

      <footer>
        <small>Desafio Fullstack — Mini Kanban</small>
      </footer>
    </div>
  );
}
