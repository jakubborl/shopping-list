import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import ActionMenu from "./ActionMenu";
import api from "./api";
import ListDialog from "./ListDialog";

export default function Form() {
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

  const [loading, setLoading] = useState(true);

  const modalRef = useRef();

  const { id } = useParams();

  const fetchList = async () => {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/lists/${id}`
    );

    setList(response.data);
  };
  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/lists/${id}/items`
      );

      setArray(response.data);
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPost = async () => {
    try {
      const response = await api.post(
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
      await api.delete(`${import.meta.env.VITE_API_URL}/items/${id}`);

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
    await api.put(`${import.meta.env.VITE_API_URL}/items/${id}`, {
      title: editTitle,
    });

    await fetchData();

    setEditingId(null);
    setEditTitle("");
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

        await api.patch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
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
      <div className="lednice">
        <h2>Seznam {lists?.name}</h2>
        <form onSubmit={addItem}>
          <div className="add-task">
            <input
              type="text"
              placeholder="Přidat položku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={addPost}>Přidat</button>
          </div>
        </form>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {array.length === 0 ? (
              <h1 className="no-list">Zatím nemáš žádné úkoly.</h1>
            ) : (
              <>
                <h2>Nesplněné</h2>
                <ul className="active-tasks-list">
                  {activeTasks.map((task) => (
                    <li className="task-wrapper" key={task.id}>
                      <div className="task-card">
                        <>
                          <div className="checkbox-wrapper-15">
                            <input
                              className="inp-cbx"
                              id={`cbx-${task.id}`}
                              type="checkbox"
                              style={{ display: "none" }}
                              checked={
                                task.completed === 1 || animatingId === task.id
                              }
                              onChange={() =>
                                toggleCompleted(task.id, task.completed)
                              }
                            />
                            <label className="cbx" htmlFor={`cbx-${task.id}`}>
                              <span>
                                <svg
                                  width="12px"
                                  height="9px"
                                  viewBox="0 0 12 9"
                                >
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
                        </>
                      </div>
                      {activeMenu === task.id && (
                        <ActionMenu
                          onEdit={() => {
                            setEditingId(task.id);
                            setEditTitle(task.title);
                          }}
                          onDelete={() => {
                            deletePost(task.id);
                          }}
                          divName="menu"
                          onShowMenu={() => setActiveMenu(null)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <h2 className="completed-title">Splněné</h2>
                <ul className="active-tasks-list">
                  {completedTasks.map((task) => (
                    <li className="task-wrapper" key={task.id}>
                      <div className="task-card">
                        <div className="checkbox-wrapper-15">
                          <input
                            className="inp-cbx"
                            id={`cbx-${task.id}`}
                            type="checkbox"
                            style={{ display: "none" }}
                            checked={
                              task.completed === 1 || animatingId === task.id
                            }
                            onChange={() =>
                              toggleCompleted(task.id, task.completed)
                            }
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
                      </div>
                      {activeMenu === task.id && (
                        <ActionMenu
                          onEdit={() => {
                            setEditingId(task.id);
                            setEditTitle(task.title);
                          }}
                          onDelete={() => {
                            deletePost(task.id);
                          }}
                          divName={"menu"}
                          onShowMenu={() => setActiveMenu(null)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}{" "}
          </>
        )}
      </div>
      <>
        {editingId && (
          <ListDialog
            name={editTitle}
            setName={setEditTitle}
            onSubmit={() => (saveEdit(editingId), setActiveMenu(false))}
            setShowForm={() => setEditingId(null)}
            title="Změna názvu"
            button="Změnit"
          />
        )}
      </>
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
