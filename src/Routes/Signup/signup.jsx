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
        <div className="cont">
        <div className="logo"><img src="/assets/add-user.png" alt="logo" height={90} width={90}
  style={{ padding: '20px' }} /></div>
        </div>
        <div className="Header">Create Account</div>
        <div className="innerBox">
          <form onSubmit={handleSubmit}>
            <div className="Ainput"> 
            <p>Name</p>
            <div className="input">
              <div className="icon">
              <img src="/assets/user.png" alt="user" height={20} width={20} /></div> 
              <input
                type="name"
                name="name"
                value={name}
                placeholder="Full Name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput"> 
            <p>Email</p>
            <div className="input">
              <div className="icon">
              <img src="/assets/email.png" alt="email" height={20} width={20} /></div> 
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email Address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput">
            <p>Password</p>
             
            <div className="input">
            <div className="icon">
            <img src="/assets/lock.png" alt="user" height={20} width={20} /></div>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Create a password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="Ainput"> 
            <p>Role</p>
            {/* <div className="input"> */}
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option name="student" id="">Student</option>
                <option name="super_admin" id="">Admin</option>
                <option name="mess_manager" id="">Mess Manager</option>
              </select>
            {/* </div> */}
          </div>



          <div className="buttons">
            <button type="submit"><div className="add" >
            <img src="/assets/add-user.png" alt="signup" height={20} width={20} /></div>Create Account</button>
          </div>



        </form>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Singup;