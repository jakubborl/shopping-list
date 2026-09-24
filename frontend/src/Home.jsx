import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ListDialog from "./ListDialog";
import DeleteListDialog from "./DeleteListDialog";
import { MoreVertical, Pencil, Trash, Trash2, Star } from "lucide-react";
import ActionMenu from "./ActionMenu";
import api from "./api";
import ListCard from "./ListCard";

export default function Home() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCurList, setEditCurList] = useState("");
  const [showCnclForm, setShowCnclForm] = useState(null);
  const favoriteLists = lists.filter((list) => list.favorite === 1);
  const normalLists = lists.filter((list) => list.favorite === 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("bezne:", normalLists);
  console.log("oblibene:", favoriteLists);
  const modalRef = useRef();

  const fetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`${import.meta.env.VITE_API_URL}/lists`);

      console.log("GET LISTS:", response.data);

      setLists(response.data);
    } catch (error) {
      setError(error.response?.data?.error || "Nepodařilo se načíst seznamy.");
    } finally {
      setLoading(false);
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

  const toggleFavorite = async (id, currentFavorite) => {
    try {
      await api.patch(`${import.meta.env.VITE_API_URL}/lists/${id}/favorite`, {
        favorite: currentFavorite === 1 ? false : true,
      });

      await fetchLists();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteClick = (list) => {
    setSelectedList(list);
    setShowCnclForm(true);
  };
  const handleCloseDelete = () => {
    setSelectedList(null);
    setShowCnclForm(false);
  };

  return (
    <>
      <div className="page">
        <div className="homepage">
          {loading ? (
            <div className="spinner"></div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              {lists.length === 0 && (
                <h1 className="no-list">Zatím nemáš žádné seznamy.</h1>
              )}
              {favoriteLists.length > 0 && (
                <>
                  <h1>Oblíbené</h1>
                  {favoriteLists.map((list) => (
                    <ListCard
                      key={list.id}
                      list={list}
                      onClose={handleCloseDelete}
                      isMenuOpen={activeMenu === list.id}
                      setisMenuOpen={setActiveMenu}
                      onFavorite={toggleFavorite}
                      onMenuClick={handleMenuClick}
                      setEditCurList={setEditCurList}
                      onDelete={handleDeleteClick}
                      setEditName={setEditName}
                      selectedList={selectedList}
                      showCnclForm={showCnclForm}
                      deleteList={deleteList}
                    />
                  ))}
                </>
              )}
              {normalLists.length > 0 && (
                <>
                  <h1>Ostatní</h1>
                  {normalLists.map((list) => (
                    <ListCard
                      key={list.id}
                      list={list}
                      onClose={handleCloseDelete}
                      isMenuOpen={activeMenu === list.id}
                      onFavorite={toggleFavorite}
                      onMenuClick={handleMenuClick}
                      setEditCurList={setEditCurList}
                      onDelete={handleDeleteClick}
                      setEditName={setEditName}
                      selectedList={selectedList}
                      showCnclForm={showCnclForm}
                      deleteList={deleteList}
                    />
                  ))}
                </>
              )}

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
            </>
          )}
          <button className="add-list-card" onClick={() => setShowForm(true)}>
            + Nový seznam
          </button>
        </div>
      </div>
    </>
  );
}
