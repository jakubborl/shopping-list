import { MoreVertical, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import DeleteListDialog from "./DeleteListDialog";

export default function ListCard({
  list,
  isMenuOpen,
  setisMenuOpen,
  onFavorite,
  onMenuClick,
  setEditCurList,
  onDelete,
  setEditName,
  onClose,
  selectedList,
  showCnclForm,
  deleteList,
}) {
  isMenuOpen;
  const navigate = useNavigate();
  return (
    <>
      <div
        key={list.id}
        className={`list-card ${isMenuOpen ? "active" : ""}`}
        onClick={() => navigate(`/list/${list.id}`)}
      >
        <div className="list-info">{list.name}</div>

        <div className="list-actions">
          <button
            className="favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(list.id, list.favorite);
            }}
          >
            <Star
              size={30}
              fill={list.favorite === 1 ? "currentColor" : "none"}
            />
          </button>

          <button
            className="favorite-button"
            onClick={(e) => onMenuClick(e, list)}
          >
            <MoreVertical />
          </button>
        </div>

        {isMenuOpen && (
          <ActionMenu
            onEdit={(e) => {
              e.stopPropagation();
              setEditCurList(true);
              onDelete;
              setEditName(list.name);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(list);
            }}
            divName="menu"
            onShowMenu={() => setisMenuOpen(null)}
          />
        )}
      </div>

      {selectedList && showCnclForm && (
        <DeleteListDialog
          list={selectedList}
          onDelete={deleteList}
          onClose={onClose}
        />
      )}
    </>
  );
}
