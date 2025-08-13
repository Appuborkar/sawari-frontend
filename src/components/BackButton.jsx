import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";


export default function BackButton({title}) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="back-btn">
      <FiArrowLeft className="icon" />
      {title}
    </button>
  );
}
