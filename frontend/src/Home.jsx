import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [newItems, setNewItems] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
      setLists(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="page">
      <div className="homepage">
        {lists.map((item) => (
          <button
            key={item.id}
            className="button-30"
            onClick={() => navigate(`/list/${item.id}`)}
          >
            {item.name}
          </button>
        ))}
        <button className="button-30">➕</button>
      </div>
    </div>
  );
}
