import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ListDialog from "./ListDialog";
import DeleteListDialog from "./DeleteListDialog";
import { MoreVertical, Pencil, Trash, Trash2, Star } from "lucide-react";
import ActionMenu from "./ActionMenu";
import api from "./api";

export default function Home() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCurList, setEditCurList] = useState("");
  const [showCnclForm, setShowCnclForm] = useState(null);

  const modalRef = useRef();

  const fetchLists = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_API_URL}/lists`);

      console.log("GET LISTS:", response.data);

      setLists(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLists();
  }, []);
  const addList = async () => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_URL}/lists`, {
        name,
      });
      await fetchLists();
      setName("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await api.delete(
        `${import.meta.env.VITE_API_URL}/lists/${id}`
      );
      await fetchLists();
      setSelectedList(null);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editList = async (id) => {
    try {
      await api.put(`${import.meta.env.VITE_API_URL}/lists/${id}`, {
        name: editName,
      });

      await fetchLists();

      setEditName("");
      setEditCurList(false);
      setActiveMenu(null);
      setSelectedList(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    await addList();
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

  return (
    <>
      <div className="page">
        <div className="homepage">
          {lists.map((item) => (
            <div
              key={item.id}
              className={`list-card ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => navigate(`/list/${item.id}`)}
            >
              <div className="list-info">{item.name}</div>

              <div className="list-actions">
                <button
                  className="favorite-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Star
                    size={30}
                    fill={item.favorite ? "currentColor" : "none"}
                  />
                </button>

                <button
                  className="favorite-button"
                  onClick={(e) => handleMenuClick(e, item)}
                >
                  <MoreVertical />
                </button>
              </div>

              {activeMenu === item.id && (
                <ActionMenu
                  onEdit={(e) => {
                    e.stopPropagation();
                    setEditCurList(true);
                    setSelectedList(item);
                    setEditName(item.name);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setShowCnclForm(true);
                    setSelectedList(item);
                  }}
                  divName="menu"
                  onShowMenu={() => setActiveMenu(null)}
                />
              )}
            </div>
          ))}
          {selectedList && showCnclForm && (
            <DeleteListDialog
              list={selectedList}
              onDelete={deleteList}
              onClose={() => setSelectedList(null)}
            />
          )}
          <button className="add-list-card" onClick={() => setShowForm(true)}>
            + Nový seznam
          </button>

          {showForm && (
            <ListDialog
              name={name}
              setName={setName}
              onSubmit={handleSubmit}
              setShowForm={setShowForm}
              title={"Nový seznam"}
              button={"Vytvořit"}
            />
          )}

          {editCurList && (
            <ListDialog
              name={editName}
              setName={setEditName}
              onSubmit={() => editList(selectedList.id)}
              setShowForm={setEditCurList}
              title="Změna názvu"
              button="Změnit"
            />
          )}
        </div>
      </div>
    </>
  );
}
