import { useEffect, useState } from "react";
import "./impact.scss";
import apiRequest from "../../lib/apiRequest";
function Impact() {
  const stats = [
    { per: "95%", d: "Student Satisfaction" },
    { per: "30%", d: "Food Waste Reduction" },
    { per: "10,000+", d: "Meals Pre-Booked Monthly" },
    { per: "40%", d: "Admin Efficiency Boost" },
  ];

  const [val, setVal] = useState([]);
  useEffect(() => {
    const getdata = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const Value = await apiRequest.get(
          "/feedbacks/feedback", // Using apiRequest with relative path
          config
        );
        // console.log("API response:", Value.data);
        setVal(Array.isArray(Value.data.data) ? Value.data.data : []);
      } catch (err) {
        console.log(err);
        setVal([]); // fallback to empty array on error
      }
    };
    getdata();
  }, []);
  // const firstWithComment = val.find(
  //   (item) => item.comment && item.studentId.name == "student"
  // );

  return (
    <div className="main1">
      <div className="container">
        <h1>Our Impact & What Students Say</h1>
        <div className="ImpactStudent">
          <div className="impact">
            <h2>Real World Impact</h2>
            <div className="stats-grid">
              {stats.map((val, key) => (
                <div className="stats" key={key}>
                  <div className="value">{val.per}</div>
                  <div className="desc">{val.d}</div>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div className="studentsay">
            <h2> Student Testimonials</h2>
            <div className="comments">
              <div className="box">
                <div className="details">
                  <span className="comment">Comment:</span> Food is great
                </div>
                <div className="details">
                  <span className="comment">Name: </span>{" "}
                </div>
                <div className="details">
                  <span className="comment">Email: </span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Impact;
