import React, { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./ann.scss";

function Ann() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest.post(
        "/mail/send",
        { subject, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(res.data.message || "Announcement sent!");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send announcement.");
    }
  };

  return (
    <div className="ann">
      <div className="container">
        <h1>Send Announcement to Students</h1>
        <form onSubmit={handleSubmit} className="ann-form">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
          <button type="submit">Send</button>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
export default Ann;
