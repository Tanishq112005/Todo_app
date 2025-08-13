import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TodoItem {
  title: string;
  description: string;
  id: number;
}

interface UserDetails {
  name: string;
  email: string;
  password: string;
}

function Dashboard(): ReactElement {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const userDetails: UserDetails | null = storedUser
    ? (JSON.parse(storedUser) as UserDetails)
    : null;

  useEffect(() => {
    async function fetchTodos(): Promise<void> {
      try {
        const response : any = await axios.post("http://localhost:3001/get_todo", {
          name: userDetails?.name,
          email: userDetails?.email,
          password: userDetails?.password,
        });
        setTodos(response.data);
      } catch (error) {
        alert("Error fetching data");
      }
    }

    if (userDetails) {
      fetchTodos();
    }
  }, []);

  async function todochange(id: number): Promise<void> {
    try {
      const response : any = await axios.post("http://localhost:3001/complete_todo", {
        name: userDetails?.name,
        email: userDetails?.email,
        password: userDetails?.password,
        id: id,
      });
      setTodos(response.data.updatedTodos);
    } catch (err) {
      alert("Todo is not removed");
    }
  }

  async function updatingTodo(): Promise<void> {
    try {
      await axios.post("http://localhost:3001/todo", {
        name: userDetails?.name,
        email: userDetails?.email,
        password: userDetails?.password,
        title: title,
        description: description,
      });

      setModal(false);
      setTitle("");
      setDescription("");

      const response : any = await axios.post("http://localhost:3001/get_todo", {
        name: userDetails?.name,
        email: userDetails?.email,
        password: userDetails?.password,
      });

      setTodos(response.data);
    } catch (err) {
      alert("Todo is not updated");
    }
  }

  function removal(): void {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="min-w-screen min-h-screen bg-gray-100 pt-10 px-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-screen h-185 grid-rows-[auto_auto_1fr_auto]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {userDetails?.name} 👋
          </h2>
          <button
            onClick={removal}
            className="hover:bg-gray-200 p-2 rounded-full transition-colors"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">Here are your todos:</p>

        <div className="h-140 overflow-auto space-y-4">
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
            <div className="flex justify-center items-center h-100 text-center text-gray-500">
              No todos available. Try adding some!
            </div>
          )}
        </div>
        {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Enter the Todo
              </h3>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="hover:bg-gray-200 p-2 rounded-full"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <button
              onClick={updatingTodo}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}
        <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setModal(true)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Add Todo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      </div>     
    </div>
  );
}

function TodoCard({
  title,
  description,
  id,
  onDelete,
}: {
  title: string;
  description: string;
  id: number;
  onDelete: (id: number) => void;
}): ReactElement {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow grid grid-cols-[1fr_auto] gap-4 items-center">
      <div className="overflow-hidden">
        <h3 className="text-lg font-semibold text-black truncate">{title}</h3>
        <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">
          {description}
        </p>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="hover:bg-gray-200 p-2 rounded-full"
        title="Mark as Done"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
}

export default Dashboard;
