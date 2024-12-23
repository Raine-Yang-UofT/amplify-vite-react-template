import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function createTodo() {
  client.models.Todo.create({
    content: window.prompt("Todo content"),
    isDone: false,
  });
}

function deleteTodo(id: string) {
  client.models.Todo.delete({ id });
}

function setDone(id: string, isDone: boolean) {
  client.models.Todo.update({ id, isDone });
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  const [todoIdToDelete, setTodoIdToDelete] = useState("");

  // listen to changes in the Todo model
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos'</h1>
      <button onClick={createTodo}>+ new</button>
      <input
        type="number"
        value={todoIdToDelete}
        onChange={(e) => setTodoIdToDelete(e.target.value)}
        placeholder="Enter todo ID to delete"
      />
      <button onClick={() => deleteTodo(todoIdToDelete)}>- remove</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => setDone(todo.id, !todo.isDone)} 
            style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
            {todo.content}
          </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
