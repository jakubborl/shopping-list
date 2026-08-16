import { Pencil, Trash } from "lucide-react";

export default function ActionMenu({ onEdit, onDelete, divName }) {
  return (
    <div className={divName}>
      <div className="menu-buttons">
        <button className="menu-item" onClick={onEdit}>
          <Pencil size={18} />
          <span>Přejmenovat</span>
        </button>
        <button className="menu-item" onClick={onDelete}>
          <Trash size={18} />
          <span>Smazat</span>
        </button>
      </div>
    </div>
  );
}
