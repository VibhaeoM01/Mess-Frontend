import { useState } from "react";
import "./contactusform.scss";
import apiRequest from "../../lib/apiRequest";

function Contactusform() {
  const [name, setName] = useState("");
  const [email, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.post("/contact", { name, email, phone });
      setSuccess(true);
      setName("");
      setMail("");
      setPhone("");
      console.log("Submitted");
    } catch (err) { 
      setSuccess(false);
      setTimeout(()=>setSuccess(null),2000); //after 2 sec, setsuccess will be null
      console.log(err);
      console.log("Some error");
    }
  };

  return (
    <section id="contact">
      <div className="mainContainer">
        <div className="contactusform">
          <h2>Contact Us</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setMail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
            {success && <p>Form Submitted Successfully</p>}
            {success==false && <p>Internal Error</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contactusform;
