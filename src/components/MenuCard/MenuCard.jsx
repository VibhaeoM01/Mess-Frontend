import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./MenuCard.scss";

function MenuCard({ menu }) {
  const [choice, setChoice] = useState(null); // null until loaded
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // OLD VERSION - COMMENTED OUT
    // const fetchChoice = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const res = await apiRequest.get(`/feedbacks/eat/status/${menu._id}`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     setChoice(res.data.willEat === null ? true : res.data.willEat); // default to true if null
    //   } catch (err) {
    //     setChoice(true); // default to true if error
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // NEW VERSION WITH DAILY RESET - Fetch the student's previous choice for this menu
    const fetchChoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiRequest.get(`/feedbacks/eat/status/${menu._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChoice(res.data.willEat); // *** NEW FEATURE: Backend now handles daily reset and defaults to true ***
      } catch (err) {
        setChoice(true); // default to true if error
      } finally {
        setLoading(false);
      }
    };
    if (menu && menu._id) fetchChoice();
  }, [menu]);

  if (!menu) return <div>No menu found</div>;
  if (loading) return <div>Loading...</div>;

  const cutoffTime = menu.cutoffTime ? new Date(menu.cutoffTime) : null;
  const now = new Date();
  const isWindowOpen = cutoffTime && now < cutoffTime;

  const handleChoice = async (willEat) => {
    if (!isWindowOpen) {
      setError("Choice window is closed for this meal.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!window.confirm(`Are you sure you want to select '${willEat ? "Yes" : "No"}' for this meal?`)) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await apiRequest.post(
        `/feedbacks/eat/${menu._id}`,
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
      await apiRequest.post(
        `/feedbacks/${menu._id}`,
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
    breakfast: { img: "/assets/2.jpg" },
    lunch: { img: "/assets/hero1.jpg" },
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
          placeholder="Share your honest review - we're here to listen!"
        ></textarea>
        <button onClick={handleCommentSubmit}>Submit</button>
        {success && <div className="messagesuccess">{success}</div>}
      </div>
    </div>
  );
}

export default MenuCard;
