import { useEffect, useState } from "react";
import API from "./services/api";

function App() {

  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: ""
  });



  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
  const response = await API.get(
    `/api/tickets?search=${search}&status=${status}`
  );

  setTickets(response.data);
};

  const createTicket = async () => {

    await API.post("/api/tickets", form);

setSearch("");
setStatus("");

loadTickets();

setForm({
  customer_name: "",
  customer_email: "",
  subject: "",
  description: ""
});
  };

  const updateStatus = async (ticketId) => {

  await API.put(
    `/api/tickets/${ticketId}`,
    {
      status: "Closed"
    }
  );

  loadTickets();
};

  return (
    <div style={{ padding: "20px" }}>

      <h1
  style={{
    textAlign: "center",
    color: "#ffffff"
  }}
>
  Support CRM Dashboard
</h1>

      <div style={{ marginBottom: "20px" }}>

  <input
    placeholder="Search Tickets"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="">All</option>
  <option value="Open">Open</option>
  <option value="Closed">Closed</option>
</select>

  <button
  onClick={loadTickets}
  style={{
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Search
</button>

</div>

      <div
  style={{
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto"
  }}
>

        <input
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={(e) =>
            setForm({ ...form, customer_name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.customer_email}
          onChange={(e) =>
            setForm({ ...form, customer_email: e.target.value })
          }
        />

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
  onClick={createTicket}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Create Ticket
</button>
      </div>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.ticket_id}</td>
              <td>{ticket.customer_name}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
              <td>
  <button
    onClick={() =>
      updateStatus(ticket.ticket_id)
    }
  >
    Close Ticket
  </button>
</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;