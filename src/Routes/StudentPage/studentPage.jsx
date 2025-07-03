import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./studentPage.scss";
import MenuCard from "../../components/MenuCard/MenuCard";
import useMenuData from "../../lib/useMenuData";

function StudentPage() {
  const { menus, allMenus, loading, error } = useMenuData();

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
        {mealTypes.map(mealType => {
          const menu = menus.find(m => m.mealType.toLowerCase() === mealType);
          return menu ? <MenuCard menu={menu} key={menu._id} /> : null;
        })}
      </div>
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
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => {
                const meals = allMenus.reduce((acc, menu) => {
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
