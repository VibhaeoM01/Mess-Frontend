import React, { useState } from 'react';
import './FreeTrial.scss';

const FreeTrial = () => {
  const meals = [
    {
      title: "Breakfast",
      items: ["Aloo Puri", "Pickle"],
      time: "08:00 AM - 10:00 AM",
      image: "https://img.freepik.com/free-photo/indian-breakfast-upma-with-papad-idli-vada-banana-leaf_466689-74524.jpg"
    },
    {
      title: "Lunch",
      items: ["Khichdi", "Papad"],
      time: "12:00 PM - 02:00 PM",
      image: "https://static.toiimg.com/thumb/msid-54308405,width-1280,resizemode-4/54308405.jpg"
    },
    {
      title: "Snacks",
      items: ["Bhel Puri", "Juice"],
      time: "05:00 PM - 06:00 PM",
      image: "https://img.freepik.com/free-photo/flat-lay-delicious-indian-food-arrangement_23-2148748812.jpg"
    },
    {
      title: "Dinner",
      items: ["Roti", "Mixed Vegetable Curry", "Curd"],
      time: "08:00 PM - 09:00 PM",
      image: "https://img.freepik.com/free-photo/top-view-indian-food-thali_23-2148748833.jpg"
    }
  ];

  const [votes, setVotes] = useState(Array(meals.length).fill(null));

  const handleVote = (index, choice) => {
    const updated = [...votes];
    updated[index] = choice;
    setVotes(updated);
  };

  const feedbacks = [
    { name: "admin", email: "admin45@manager.in", message: "The food was delicious, but the dessert was too sweet." },
    { name: "Anonymous", email: "", message: "The food is truly delicious! Thank you, MessMaster..." },
    { name: "Anonymous", email: "", message: "food was good" },
    { name: "admin1", email: "admin1@manager.in", message: "food was amazing" },
    { name: "admin", email: "admin1@manager.in", message: "food was bad" },
  ];

  return (
    <div className="container">
      {/* Meals Section */}
      <div className="meals">
        {meals.map((meal, idx) => (
          <div className="meal-card" key={idx}>
            <img src={meal.image} alt={meal.title} />
            <h2>{meal.title}</h2>
            <ul>
              {meal.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <p><b>Time:</b> {meal.time}</p>
            <div className="buttons">
              <button
                className={`yes ${votes[idx] === 'yes' ? 'active' : ''}`}
                onClick={() => handleVote(idx, 'yes')}
              >Yes</button>
              <button
                className={`no ${votes[idx] === 'no' ? 'active' : ''}`}
                onClick={() => handleVote(idx, 'no')}
              >No</button>
            </div>
            <textarea placeholder="Share your thoughts about this meal... We'd love to hear from you!" />
            <button className="submit">Submit</button>
          </div>
        ))}
      </div>

      {/* Complete Menu Table */}
      <h2>Complete Menu</h2>
      <table className="menu-table">
        <thead>
          <tr>
            <th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snacks</th><th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monday</td><td>Tea</td><td>Rice, Dal, Vegetable Curry</td><td>Samosa, Tea</td><td>Noodles</td></tr>
          <tr><td>Tuesday</td><td>Paratha, Curd</td><td>Fried Rice, Manchurian</td><td>Pakora, Chutney</td><td>Naan, Butter Chicken, Raita</td></tr>
          <tr><td>Wednesday</td><td>Dosa, Sambhar</td><td>Biryani, Raita</td><td>Bread Pakora, Tea</td><td>Rice, Rajma, Salad</td></tr>
          <tr><td>Thursday</td><td>Aloo Puri, Pickle</td><td>Khichdi, Papad</td><td>Bhel Puri, Juice</td><td>Roti, Mixed Vegetable Curry, Curd</td></tr>
          <tr><td>Friday</td><td>Dosa, Coconut Chutney</td><td>Chapati, Veg Anda Curry, Salad</td><td>Cutlets, Tea</td><td>Chapati, Veg Anda Curry, Salad</td></tr>
          <tr><td>Saturday</td><td>Chole Bhature, Lassi</td><td>Pulao, Paneer Butter Masala</td><td>Kachori, Chutney</td><td>Roti, Dal Tadka, Pickle</td></tr>
        </tbody>
      </table>

      {/* Announcement Box */}
      <div className="announcement-box">
        <h2>Send Announcement to Students</h2>
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Message" />
        <button>Send</button>
      </div>

      {/* Update Menu */}
      <div className="update-menu">
        <h2>Update Menu</h2>
        <select><option>Monday</option></select>
        <select><option>Breakfast</option></select>
        <input type="text" placeholder="New Item" />
        <button>Submit</button>

        <h3>Student Feedback</h3>
        {feedbacks.map((f, i) => (
          <div key={i} className="feedback-box">
            <em>"{f.message}"</em>
            <p>— {f.name} {f.email ? `(${f.email})` : "(No email)"}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="chart-box">
        <h2>Mess Wastage Reduction Over Weeks</h2>
        <img
          src="https://quickchart.io/chart?c={type:'line',data:{labels:['Week 1','Week 2','Week 3','Week 4','Week 5'],datasets:[{label:'Total Wastage (kg)',data:[240,248,242,90,100]}]}}"
          alt="Wastage Chart"
        />
        <p>Loading sentiment trends...</p>
      </div>
    </div>
  );
};

export default FreeTrial;
