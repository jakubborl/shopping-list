import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <button onClick={() => navigate("/lednice")} className="button-30">
        🧊
      </button>
      <button onClick={() => navigate("/skrin")} className="button-30">
        🗄️
      </button>
      <button onClick={() => navigate("/nakup")} className="button-30">
        🛒
      </button>
    </div>
  );
}
