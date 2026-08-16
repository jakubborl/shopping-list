import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ListDialog from "./ListDialog";
import DeleteListDialog from "./DeleteListDialog";
import { MoreVertical, Pencil, Trash, Trash2 } from "lucide-react";
import ActionMenu from "./ActionMenu";

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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lists`,
        {
          name,
        }
      );
      await fetchLists();
      setName("");
      setShowForm(false);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await axios.delete(
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
      await axios.put(`${import.meta.env.VITE_API_URL}/lists/${id}`, {
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
    <div className="page">
      <div className="homepage">
        {lists.map((item) => (
          <div key={item.id}>
            <div
              className={`list-card ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => navigate(`/list/${item.id}`)}
            >
              <div className="list-info">{item.name}</div>
              <button onClick={(e) => handleMenuClick(e, item)}>
                <MoreVertical />
              </button>
              {activeMenu === item.id && (
                <ActionMenu
                  onEdit={(e) => {
                    e.stopPropagation();
                    setEditCurList(true);
                    setSelectedList(item);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setShowCnclForm(true);
                    setSelectedList(item);
                  }}
                  divName={"menu"}
                  onShowMenu={() => setActiveMenu(null)}
                />
              )}
            </div>
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
          ➕ Nový seznam
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
            onSubmit={() => editList(selectedList.id)}
            setName={setEditName}
            setShowForm={setEditCurList}
            title="Změna názvu"
            button="Změnit"
          />
        )}
      </div>
    </div>
  );
}
