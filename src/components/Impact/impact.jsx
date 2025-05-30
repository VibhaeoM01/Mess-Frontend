import { useEffect, useState } from "react";
import "./impact.scss";
import axios from "axios";
function Impact() {
    const [val, setVal] = useState([]);
    useEffect(() => {
        const getdata = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const Value = await axios.get("http://localhost:5000/api/feedbacks/feedback", config);
                console.log("API response:", Value.data);
                setVal(Array.isArray(Value.data.data) ? Value.data.data : []);
            } catch (err) {
                console.log(err);
                setVal([]); // fallback to empty array on error
            }
        };
        getdata();
    }, []);
    const firstWithComment = val.find(item => item.comment && item.studentId.name=="student");

   return (
  <div className="impact">
    Impact
    <div className="comment">
      {firstWithComment ? (
        <>
          <div>Comment: {firstWithComment.comment}</div>
          <div>Student Name: {firstWithComment.studentId?.name}</div>
          <div>Student Email: {firstWithComment.studentId?.email}</div>
        </>
      ) : (
        <div>No comments found.</div>
      )}
    </div>
  </div>
);
}

export default Impact;