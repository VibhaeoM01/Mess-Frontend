import { useState } from "react";
import axios from "axios";
import "./MenuCard.scss";

function MenuCard({ menu }) {
  const [choice, setChoice] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(null);

  

  if (!menu) return <div>No menu found</div>;

  const cutoffTime = menu.cutoffTime ? new Date(menu.cutoffTime) : null;
  const now = new Date();
  const isWindowOpen = cutoffTime && now < cutoffTime;

  const handleChoice = async (willEat) => {
    if (!isWindowOpen) {
      setError("Choice window is closed for this meal.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        // `http://localhost:5000/api/feedbacks/eat/${menu._id}`,  // Local development URL
        `https://mess-backend-01.onrender.com/api/feedbacks/eat/${menu._id}`,  // Deployed URL
        { willEat },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChoice(willEat);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to submit choice");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment === "") {
      setError("Comment cannot be empty.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        // `http://localhost:5000/api/feedbacks/${menu._id}`,  // Local development URL
        `https://mess-backend-01.onrender.com/api/feedbacks/${menu._id}`,  // Deployed URL
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError(null);
      setComment("");
      setSuccess("Comment submitted!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message); 
      } else {
        setError("Failed to submit comment");
      }
      setSuccess(null);
      setTimeout(() => setError(null), 3000);
    }
  };


  const photos = {
    breakfast: { img: "/assets/1.jpg" },
    lunch: { img: "/assets/2.jpg" },
    snacks: { img: "/assets/3.jpg" },
    dinner: { img: "/assets/1.jpg" }
  };
  
  return (
    <div className="menuCard">
      <div className="image-container">
        <img 
          className="image" 
          src={photos[menu.mealType.toLowerCase()]?.img || "/assets/1.jpg"}
          alt={`${menu.mealType} menu`}
        />
      </div>
      <h2 className="mealType">{menu.mealType}</h2>
      <div className="items">
        {Array.isArray(menu.items) && menu.items.length > 0 ? (
          <ol>
            {menu.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        ) : (
          <p>No items listed</p>
        )}
      </div>
      <p className="time">Time: {menu.time}</p>
      <div className="buttons">
        <button
          className={`but yes ${choice === true ? "selected" : ""}`}
          onClick={() => handleChoice(true)}
        >
          Yes
        </button>
        <button
          className={`but no ${choice === false ? "selected" : ""}`}
          onClick={() => handleChoice(false)}
        >
          No
        </button>
      </div>
      {error && <p className="message error">{error}</p>}
      <div className="comment">
        <p>Comment:-</p>
        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter text here..."
        ></textarea>
        <button onClick={handleCommentSubmit}>Submit</button>
        {success && <div className="messagesuccess">{success}</div>}
      </div>
    </div>
  );
}

export default MenuCard;
