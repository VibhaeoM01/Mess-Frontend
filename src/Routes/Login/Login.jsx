import { useState } from "react";
import "./Login.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null); 
      try {
        const res = await apiRequest.post("/auth/login", { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        login(res.data.user, res.data.token);
        navigate(`/${res.data.user.role}`); 
      } catch (err) {
         console.log("Login error:", err);       
        setError(err.response?.data?.message);
      } 

    };

  return (
    <div className="login">
      <div className="Box">
        <div className="Header">Lo<span style={{textDecoration:"none"}}>g</span>in</div>
        <p className="wlcm">Welcome Back! Help Us Save Food</p> 
        <form onSubmit={handleSubmit}>
          <div className="Ainput">
            <p>Email</p>
            <div className="input">
              <div className="icon">
                <img src="/assets/email.png" alt="email" height={20} width={20} />
              </div>
              <input type="email" name="email" value={email} placeholder="Email Address" required onChange={(e)=>setEmail(e.target.value)} />
            </div>
          </div>
          <div className="Ainput">
            <p>Password</p>
            <div className="input">
              <div className="icon">
                <img src="/assets/lock.png" alt="password" height={20} width={20} />
              </div>
              <input type="password" name="password" value={password} placeholder="Enter your password" required onChange={(e)=>setPassword(e.target.value)} />
            </div>
          </div>
          <div className="buttons">
            <button type="submit"> 
              Login
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>} 
      </div>
    </div>
  );
}

export default Login; 