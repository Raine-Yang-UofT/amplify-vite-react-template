import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function createHours(employee: string) {
  client.models.WorkHour.create({
    employee: employee,
    hours: (() => {
      const input = window.prompt("Enter your work hours");
      const parsedHours = parseFloat(input ?? "0");
      return !isNaN(parsedHours) && parsedHours >= 0 ? parsedHours : 0;
    })(),
    date: new Date().toISOString(),
  });
}

function deleteHour(id: string) {
  client.models.WorkHour.delete({ id });
}


function App() {
  const [hours, setHours] = useState<Array<Schema["WorkHour"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  const username: string = user?.signInDetails?.loginId ?? "unknown user";

  useEffect(() => {
    client.models.WorkHour.observeQuery().subscribe({
      next: (data) => setHours([...data.items]),
    });
  }, []);

  return (
    <main>
      <h1>Hello: {username}'</h1>
      <button onClick={() => createHours(username)}>+ new</button>
      <ul>
        {hours.map((hour) => (
          <li
            key={hour.id}
            onClick={() => deleteHour(hour.id)}>
            {hour.employee}: worked on {hour.hours} hours on {hour.date}
          </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
