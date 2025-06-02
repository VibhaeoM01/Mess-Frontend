import { useState } from "react";
import "./signup.scss";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Singup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,setName]=useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiRequest.post("/auth/register", { name, email, password, role });
      console.log("Login success:", res.data); 
      // login(res.data.user, res.data.token); 
      navigate(`/`);
    } catch (err) {
      console.error("Full error object:", err);  
      setError(err.response.data.message || "Server Error");
    }
  };

  return (
    <div className="signup">
      <div className="Box">
        <div className="Header">New to Mess? Signup</div>
        <div className="innerBox">
          <form onSubmit={handleSubmit}>
            <div className="Ainput"> 
            <p>Name</p>
            <div className="input">
              <input
                type="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput"> 
            <p>Email</p>
            <div className="input">
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput">
            <p>Password</p>
            <div className="input">
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput"> 
            <p>Role</p>
            <div className="input">
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option name="student" id="">Student</option>
                <option name="super_admin" id="">Admin</option>
                <option name="mess_manager" id="">Mess Manager</option>
              </select>
            </div>
          </div>
          <div className="buttons">
            <button type="submit">Signup</button>
          </div>
        </form>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Singup;
