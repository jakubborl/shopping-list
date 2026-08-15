export default function DeleteListDialog({ list, onDelete, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-list-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Opravdu chcete smazat seznam {list.name}?</h2>

        <label>Budou smazány i všechny položky</label>

        <div className="dialog-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Zrušit
          </button>

          <button
            type="button"
            className="create-btn"
            onClick={() => onDelete(list.id)}
          >
            Ano
          </button>
        </div>
      </div>
    </div>
  );
}
