import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton({ title}) {
  const navigate = useNavigate();

  const handleBack = async () => {
      navigate(-1); 
  };

  return (
    <button onClick={handleBack} className="back-btn">
      <FiArrowLeft className="icon" />
      {title}
    </button>
  );
}
