import "./UserModal.css";

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{user.username}</h2>
        <p>
          <strong>Level:</strong> {user.level}
        </p>
        <p>
          <strong>Overall:</strong> {user.overallStat.toFixed(2)}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
        <p>
          <strong>Age:</strong> {user.age} years
        </p>
      </div>
    </div>
  );
};

export default UserModal;
