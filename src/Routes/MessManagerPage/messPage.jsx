import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./messPage.scss";
import { useNavigate } from "react-router-dom";
import useMenuData from "../../lib/useMenuData";
import MenuCard from "../../components/MenuCard/MenuCard";

function MessPage() {
  const { menus, allMenus, loading, error } = useMenuData();
  const [mealCounts, setMealCounts] = useState(null);
  const [day, setDay] = useState("Monday");
  const [mealType, setMeal] = useState("breakfast");
  const [items, setitems] = useState("");
  const [success, setsuccess] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const mealCountsRes = await apiRequest.get("/feedbacks/count", config);
        setMealCounts(mealCountsRes.data.data);
        const feedbacks = await apiRequest.get("/feedbacks/feedback", config);
        setFeedback(feedbacks.data.data);
      } catch (err) {
        setFeedback([]);
        setMealCounts(null);
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const menu = allMenus.find(
      (m) =>
        m.day.toLowerCase() === day.toLowerCase() &&
        m.mealType.toLowerCase() === mealType.toLowerCase()
    );
    // const menu = allMenus.find((m) => m.day === day && m.mealType === mealType);
    console.log(menu);
    if (!menu) {
      alert("Menu not found for the selected day and meal type.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await apiRequest.put(
        `/menus/update/${menu._id}`,
        { day, mealType, items },
        config
      );
      console.log("Updated:", res.data);
      setsuccess(true);
      setTimeout(() => setsuccess(false), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="messPage">
      <div className="cont">
      <div className="cards">
        {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => {
          const menu = menus.find((m) => m.mealType.toLowerCase() === mealType);
          return menu ? (
            <div className="menuCard" key={menu._id}>
              <div className="image-container">
                <img 
                  className="image" 
                  src={
                    mealType === "breakfast" ? "/assets/2.jpg" :
                    mealType === "lunch" ? "/assets/hero1.jpg" :
                    mealType === "snacks" ? "/assets/3.jpg" :
                    "/assets/1.jpg"
                  }
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
              {/* REMOVED: Yes/No buttons and comment section for mess manager */}
            </div>
          ) : null;
        })}
      </div>
      </div>
       <div className="announcement" onClick={() => nav("/mess_manager/ann")}>
          Add Announcement
        </div>
      <div className="preBookcount">
        <h2>Pre-Bookings</h2>
        {mealCounts ? (
          <ul>
            {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
              <li key={meal}>
                <span className="names">
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}:{" "}
                </span>
                {mealCounts[meal]?.willEat ?? 0}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data</p>
        )}
      </div>
      {/* <div className="container"> */}
        {allMenus.length == 0 && (
          <div className="stats" onClick={() => nav("/mess_manager/stats")}>
            Add Menu
          </div>
        )}{" "}
        <div className="stats" onClick={() => nav("/mess_manager/stats")}>
          Stats
        </div>
        <div className="stats analytics-button" onClick={() => nav("/mess_manager/analytics")}>
          Meal Analytics
        </div>
      {/* </div> */}
      <div className="all-menus">
        <h2>Complete Menu</h2>
        {allMenus.length > 0 ? (
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Snacks</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => {
                const meals = allMenus.reduce((acc, menu) => {
                  if (menu.day === day) {
                    acc[menu.mealType] = menu.items.join(", ");
                  }
                  return acc;
                }, {});
                return (
                  <tr key={day}>
                    <td>
                      <strong>{day}</strong>
                    </td>
                    <td>{meals.breakfast || "-"}</td>
                    <td>{meals.lunch || "-"}</td>
                    <td>{meals.snacks || "-"}</td>
                    <td>{meals.dinner || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No complete menu found</p>
        )}
      </div>

      <div className="update-Menu">
        <h2>Update Menu</h2>
        <div className="fields">
          <form onSubmit={handleSubmit}>
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <select value={mealType} onChange={(e) => setMeal(e.target.value)}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
            <input
              type="text"
              value={items}
              required
              onChange={(e) => setitems(e.target.value)}
            />
            <button>Submit</button>
            {success && <p>Menu Changed</p>}
          </form>
        </div>
      </div>
      <div className="feedbacks">
        <h2>Student Feedback</h2>
       <div className="inner">
         {feedback.length > 0 ? (
          feedback.map((fb) => (
            <div className="feedback-card" key={fb._id}>
              <p>"{fb.comment}"</p>
              <div>
                — {fb.studentId?.name || "Anonymous"} (
                {fb.studentId?.email || "No email"})
              </div>
            </div>
          ))
        ) : (
          <p>No feedback yet.</p>
        )}
      </div>
       </div>
    </div>
  );
}

export default MessPage;
