import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const heroImageUrl = "/hero-background.jpg";

interface TodoItem {
  title: string;
  description: string;
  id: number;
}

interface UserDetails {
  name: string;
  email: string;
  password : string ;
}

function Dashboard(): ReactElement {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const userDetails: UserDetails | null = storedUser
    ? (JSON.parse(storedUser) as UserDetails)
    : null;

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response: any = await axios.post(
          "http://localhost:3001/get_todo",
          { email: userDetails?.email ,
            password : userDetails?.password
          }
        );
        setTodos(response.data);
      } catch (error) {
        alert("Error fetching data. You may be logged out.");
        navigate("/login");
      }
    }

    if (userDetails) {
      void fetchTodos();
    } else {
      navigate("/login");
    }
  }, [userDetails]);

  async function todochange(id: number): Promise<void> {
    try {
      const response: any = await axios.post(
        "http://localhost:3001/complete_todo",
        { email: userDetails?.email, id: id }
      );
      setTodos(response.data.updatedTodos);
    } catch (err) {
      alert("Todo could not be marked as complete.");
    }
  }

  async function updatingTodo(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:3001/todo", {
        email: userDetails?.email,
        title: title,
        description: description,
      });

      setModal(false);
      setTitle("");
      setDescription("");

      const response: any = await axios.post(
        "http://localhost:3001/get_todo",
        { email: userDetails?.email }
      );
      setTodos(response.data);
    } catch (err) {
      alert("Todo could not be added.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function removal(): void {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
   
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      <div className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-4 sm:p-6 rounded-2xl shadow-2xl min-w-[170vh] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Welcome, {userDetails?.name} 👋
          </h2>
          <button
            onClick={removal}
            className="text-slate-400 hover:bg-slate-700 p-2 rounded-full transition-colors"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-4 flex-shrink-0">
          Here are your tasks for today:
        </p>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
          {todos.length > 0 ? (
            todos.map((item) => (
              <TodoCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                onDelete={todochange}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-center text-slate-400">
              <p>All clear! Add a new task to get started.</p>
            </div>
          )}
        </div>

        
        <div className="mt-4 flex justify-center flex-shrink-0">
          <button
            type="button"
            onClick={() => setModal(true)}
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg transition-all"
            title="Add Todo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>


      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-xl shadow-lg w-11/12 max-w-md space-y-4 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-100">
                Add a New Task
              </h3>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="text-slate-400 hover:bg-slate-700 p-2 rounded-full"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={updatingTodo}>
              <input
                type="text"
                placeholder="Task Title (e.g., Finish project report)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-700 text-slate-100 border border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <textarea
                placeholder="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-3 w-full bg-slate-700 text-slate-100 border border-slate-600 rounded-md px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={!title || isSubmitting}
                className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TodoCard({ title, description, id, onDelete }: TodoItem & { onDelete: (id: number) => void }): ReactElement {
  return (
    <div className="bg-slate-700/50 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-slate-600/60 transition-all grid grid-cols-[1fr_auto] gap-4 items-center">
      <div className="overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-100 truncate">{title}</h3>
        {description && <p className="text-sm text-slate-300 break-words whitespace-pre-wrap mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-slate-400 hover:text-green-400 hover:bg-slate-600 p-2 rounded-full transition-colors flex-shrink-0"
        title="Mark as Done"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
    </div>
  );
}

export default Dashboard;