import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import ActionMenu from "./ActionMenu";

export default function Form({ listId, showButton = false }) {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [array, setArray] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [lists, setList] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const activeTasks = array.filter((task) => task.completed === 0);
  const completedTasks = array.filter((task) => task.completed === 1);
  const [animatingId, setAnimatingId] = useState(null);

  const modalRef = useRef();

  const { id } = useParams();

  const fetchList = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lists/${id}`
    );

    setList(response.data);
  };
  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lists/${id}/items`
    );

    setArray(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPost = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lists/${id}/items`,
        {
          title,
        }
      );
      await fetchData();
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/items/${id}`);

      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  function addItem(e) {
    e.preventDefault();

    setItems([...items, item]);
    setItem("");
  }
  const saveEdit = async (id) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/items/${id}`, {
      title: editTitle,
    });

    await fetchData();

    setEditingId(null);
    setEditTitle("");
  };

  const movePost = async (id, newList) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${id}/move`, {
      newList: newList,
    });

    await fetchData();
  };

  function handleMenuClick(e, item) {
    e.stopPropagation();

    if (activeMenu === item.id) {
      setActiveMenu(null);
    } else {
      setActiveMenu(item.id);
    }
  }

  useEffect(() => {
    function handler(event) {
      if (!modalRef.current?.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const toggleCompleted = async (id, currentCompleted) => {
    setAnimatingId(id);

    setTimeout(async () => {
      try {
        const newCompleted = currentCompleted === 1 ? false : true;

        await axios.patch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
          completed: newCompleted,
        });

        setArray((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed: newCompleted ? 1 : 0 } : task
          )
        );

        setAnimatingId(null);
      } catch (error) {
        console.error(error);
        setAnimatingId(null);
      }
    }, 600);
  };

  return (
    <>
      <Link to="/" className="button-66">
        Domů
      </Link>
      <div className="lednice">
        <h2>Seznam {lists?.name}</h2>
        <form onSubmit={addItem}>
          <div className="row">
            <input
              className="polozka"
              type="text"
              placeholder="Přidat položku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="button-66" onClick={addPost}>
              Přidat
            </button>
          </div>
        </form>
        <h2>Nesplněné</h2>
        <ul className="active-tasks-list">
          {activeTasks.map((task) => (
            <li className="task-card" key={task.id}>
              {editingId === task.id ? (
                <>
                  <input
                    className="change"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: `${Math.max(editTitle.length, 1)}ch` }}
                  />

                  <button
                    className="change-btn"
                    onClick={() => saveEdit(task.id)}
                  >
                    Uložit
                  </button>
                </>
              ) : (
                <>
                  <div className="checkbox-wrapper-15">
                    <input
                      className="inp-cbx"
                      id={`cbx-${task.id}`}
                      type="checkbox"
                      style={{ display: "none" }}
                      checked={task.completed === 1 || animatingId === task.id}
                      onChange={() => toggleCompleted(task.id, task.completed)}
                    />
                    <label className="cbx" htmlFor={`cbx-${task.id}`}>
                      <span>
                        <svg width="12px" height="9px" viewBox="0 0 12 9">
                          <polyline points="1 5 4 8 11 1"></polyline>
                        </svg>
                      </span>
                      <span>{task.title}</span>
                    </label>
                  </div>
                  <button
                    className="btn-vertical"
                    onClick={(e) => handleMenuClick(e, task)}
                  >
                    <MoreVertical />
                  </button>
                  {activeMenu === task.id && (
                    <div ref={modalRef}>
                      <ActionMenu
                        onEdit={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                        }}
                        onDelete={() => {
                          deletePost(task.id);
                        }}
                        divName={"form-menu"}
                        onShowMenu={() => setActiveMenu(null)}
                      />
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <h2 className="completed-title">Splněné</h2>
        <ul className="active-tasks-list">
          {completedTasks.map((task) => (
            <li className="task-card" key={task.id}>
              <div className="checkbox-wrapper-15">
                <input
                  className="inp-cbx"
                  id={`cbx-${task.id}`}
                  type="checkbox"
                  style={{ display: "none" }}
                  checked={task.completed === 1 || animatingId === task.id}
                  onChange={() => toggleCompleted(task.id, task.completed)}
                />
                <label className="cbx" htmlFor={`cbx-${task.id}`}>
                  <span>
                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                      <polyline points="1 5 4 8 11 1"></polyline>
                    </svg>
                  </span>
                  <span>
                    {task.title} {"| "}
                    {task.completed}
                  </span>
                </label>
              </div>
              <button
                className="btn-vertical"
                onClick={(e) => handleMenuClick(e, task)}
              >
                <MoreVertical />
              </button>
              {activeMenu === task.id && (
                <div ref={modalRef}>
                  <ActionMenu
                    onEdit={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                    }}
                    onDelete={() => {
                      deletePost(task.id);
                    }}
                    divName={"form-menu"}
                    onShowMenu={() => setActiveMenu(null)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
{
  /* <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleCompleted(item.id, !item.completed)}
                  />
                  <span>{task.title}</span> */
}
