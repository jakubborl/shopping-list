export default function ListDialog({
  name,
  setName,
  setShowForm,
  title,
  button,
  onSubmit,
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="list-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit();
          }}
        >
          <input
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Např. Grilování"
          />

          <div className="dialog-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setName("");
              }}
            >
              Zrušit
            </button>

            <button type="submit" className="create-btn">
              {button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
