import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./studentPage.scss";
import MenuCard from "../../components/MenuCard/MenuCard";

function StudentPage() {
  const [menus, setMenus] = useState([]);
  const [Allmenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const [todayRes, allRes] = await Promise.all([
          apiRequest.get("/menus", config),
          apiRequest.get("/menus/all", config),
        ]);
        setMenus(todayRes.data);
        setAllMenus(allRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menus");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];
  if (!menus || menus.length === 0) {
    return (
      <div className="menuCards">
        {mealTypes.map(meal => (
          <div className="menuCard empty" key={meal}>
            <h2>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h2>
            <p>No menu for today</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="studentPage">
      <div className="cards">
        {["breakfast", "lunch", "snacks", "dinner"].map(mealType => {
  const menu = menus.find(m => m.mealType.toLowerCase() === mealType);
  return menu ? <MenuCard menu={menu} key={menu._id} /> : null;
})}
      </div>
      <div className="all-menus">
        <h2>Complete Menu</h2>
        {Allmenus.length > 0 ? (
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
                "Saturday"
              ].map((day) => {
                const meals = Allmenus.reduce((acc, menu) => {
                  if (menu.day === day) {
                    acc[menu.mealType] = menu.items.join(", ");
                  }
                  return acc;
                }, {});
                return (
                  <tr key={day}>
                    <td><strong>{day}</strong></td>
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
    </div>
  );
}

export default StudentPage;
