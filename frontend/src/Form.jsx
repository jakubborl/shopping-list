import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function Form({ listId, showButton = false }) {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [array, setArray] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [lists, setList] = useState(null);

  const { id } = useParams();
  console.log(id);

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
    console.log(`odkaz ${import.meta.env.VITE_API_URL}`);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lists/${id}/items`
    );

    setArray(response.data);
    console.log("array:", response);
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

      console.log(response.data);
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
                  {/* {showButton && (
                    <>
                      <button
                        className="change-btn"
                        onClick={() => movePost(blog.id, "lednice")}
                      >
                        Lednice✅
                      </button>
                      <button
                        className="change-btn"
                        onClick={() => movePost(blog.id, "skrin")}
                      >
                        Skříň✅
                      </button>
                    </>
                  )} */}
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
