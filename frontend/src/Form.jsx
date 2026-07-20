import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Form({ nazev }) {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [array, setArray] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const addPost = async () => {
    try {
      console.log(`nazev:`, nazev);
      const response = await axios.post(
        `http://localhost:8080/posts/${nazev}`,
        {
          title,
        }
      );
      await fetchData();
      setTitle("");
      console.log(`nazev:`, nazev);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/posts/${nazev}/${id}`);

      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    const response = await axios.get(`http://localhost:8080/posts/${nazev}`);

    setArray(response.data);

    console.log("data:", response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function addItem(e) {
    e.preventDefault();

    setItems([...items, item]);
    setItem("");
  }
  const saveEdit = async (id) => {
    await axios.put(`http://localhost:8080/posts/${nazev}/${id}`, {
      title: editTitle,
    });

    await fetchData();

    setEditingId(null);
    setEditTitle("");
  };

  return (
    <>
      <Link to="/" className="button-66">
        Domů
      </Link>
      <div className="lednice">
        <h2>Seznam {nazev}</h2>
        <form onSubmit={addItem}>
          <div className="row">
            <input
              className="polozka"
              type="text"
              placeholder="Přidat položku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onChangeCapture={console.log("title:", title)}
            />
            <button className="button-66" onClick={addPost}>
              Přidat
            </button>
          </div>
        </form>

        <ul>
          {array.map((blog) => (
            <li key={blog.id}>
              {editingId === blog.id ? (
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
                    onClick={() => saveEdit(blog.id)}
                  >
                    Uložit
                  </button>
                </>
              ) : (
                <>
                  {blog.title}
                  <button
                    className="close-btn"
                    onClick={() => deletePost(blog.id)}
                  >
                    ×
                  </button>
                  <button
                    className="change-btn"
                    onClick={() => {
                      setEditingId(blog.id);
                      setEditTitle(blog.title);
                    }}
                  >
                    Upravit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
// <div>
//   <h1>Backend with Express & Node</h1>
//   <ul>
//     {array.map((blog, index) => (
//       <li key={index}>
//         <p>{blog.title}</p>
//         <p>{blog.content}</p>
//       </li>
//     ))}
//   </ul>
// </div>

{
  /* <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button className="close-btn" onClick={() => onDeleteItems(index)}>
              ×
            </button>
          </li>
        ))}
      </ul> */
}
