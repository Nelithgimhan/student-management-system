
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load students.");
      }

      const data = await response.json();
      setStudents(data);
      setError("");
    } catch {
      setError("Cannot connect to the backend. Is Spring Boot running?");
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, course }),
      });

      if (!response.ok) {
        throw new Error("Could not add student.");
      }

      setName("");
      setEmail("");
      setCourse("");
      await loadStudents();
    } catch {
      setError("Could not add student. Check the backend.");
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete student.");
      }

      await loadStudents();
    } catch {
      setError("Could not delete student. Check the backend.");
    }
  }

  return (
    <main className="container">
      <h1>Student Management System</h1>
      <p className="subtitle">
        Manage student details using React and Spring Boot.
      </p>

      <section className="card">
        <h2>Add a Student</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter student name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              required
            />
          </label>

          <label>
            Course
            <input
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="Enter course"
              required
            />
          </label>

          <button type="submit">Add Student</button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Student List</h2>

        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
