import React, { useState, useEffect } from "react";

// ✅ ALWAYS use localhost for browser
const API = "http://localhost:5000";

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch(API + "/users");
    const data = await res.json();
    setUsers(data);
  }

  // CREATE
  async function addUser() {
    if (!name || !age) return alert("Enter name and age");

    await fetch(API + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age }),
    });

    setName("");
    setAge("");
    loadUsers();
  }

  // DELETE
  async function deleteUser(id) {
    await fetch(API + "/users/" + id, {
      method: "DELETE",
    });
    loadUsers();
  }

  // UPDATE
  async function updateUser() {
    await fetch(API + "/users/" + editUser._id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editUser.name,
        age: editUser.age,
      }),
    });

    setEditUser(null);
    loadUsers();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Simple CRUD App</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={addUser}>Add</button>

      <hr />

      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {editUser?._id === u._id ? (
              <>
                <input
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />

                <input
                  value={editUser.age}
                  onChange={(e) =>
                    setEditUser({ ...editUser, age: e.target.value })
                  }
                />

                <button onClick={updateUser}>Save</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                {u.name} ({u.age})
                <button onClick={() => setEditUser(u)}>Edit</button>
                <button onClick={() => deleteUser(u._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}