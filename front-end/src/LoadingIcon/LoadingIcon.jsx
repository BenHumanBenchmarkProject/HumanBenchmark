import { useLoading } from "../loadingContext";
import "./LoadingIcon.css";

const LoadingIcon = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner" />
      {console.log("loading...")}
    </div>
  );
};

export default LoadingIcon;
