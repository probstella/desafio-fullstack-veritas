
const BASE = "http://localhost:8080/tasks";

export async function fetchTasks() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Falha ao buscar tarefas");
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'unknown'}));
    throw new Error(err.error || "Erro ao criar tarefa");
  }
  return res.json();
}

export async function updateTask(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'unknown'}));
    throw new Error(err.error || "Erro ao atualizar");
  }
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar");
  return true;
}
