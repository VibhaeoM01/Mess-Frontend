import { useState } from "react";
import "./signup.scss";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import apiRequest from "../../lib/apiRequest";

function Singup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
   const [messId, setMessId] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // BASIC VALIDATION
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    // BASIC VALIDATION
 

    try {
      console.log("Attempting registration with:", { name, email, role });
      
      const res = await apiRequest.post("/auth/register", { 
        name: name.trim(), 
        email: email.trim(), 
        password, 
        role 
      });
      
      console.log("Registration success:", res.data);
      
      // Show success toast
      addToast({
        message: `🎉 Account created successfully! Welcome ${name}!`,
        type: 'success',
        duration: 4000
      });
      navigate('/login');
      // Optional: Auto-login after registration
      // if (res.data.token && res.data.user) {
      //   login(res.data.user, res.data.token);
      //   navigate(`/${res.data.user.role}`);
      // } else {
      //   navigate('/login');
      // }
      
    } catch (err) {
      console.error("Registration error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show error toast
      addToast({
        message: `❌ Registration failed: ${errorMessage}`,
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
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
          <div className="Ainput role-section"> 
            <p>Account Type</p>
            <div className="role-info">
              <small>Choose your role: Students join existing messes, Mess Managers create and manage messes</small>
            </div>
            <select value={role} onChange={e=>setRole(e.target.value)} className="role-select">
              <option value="student">🎓 Student - Join existing mess</option>
              <option value="mess_manager">👨‍💼 Mess Manager - Create & manage mess</option>
              <option value="super_admin">🔧 Admin - System administrator</option>
            </select>
            {role === 'mess_manager' && (
              <div className="role-note">
                <small>💡 As a Mess Manager, you'll be able to generate Mess IDs and manage your mess operations</small>
              </div>
            )}
            {role === 'student' && (
              <div className="role-note">
                <small>📚 As a Student, you can join existing messes using their Mess ID</small>
              </div>
            )}
          </div>
          {role === "student" && (
          <div className="Ainput">
            <p>Mess ID</p>
            <div className="input">
              <div className="icon">
                <img src="/assets/id.png" alt="mess-id" height={20} width={20} />
              </div>
              <input
                type="text"
                name="messId"
                value={messId}
                placeholder="Enter your mess ID (e.g., MESS_12345)"
                required
                onChange={(e) => setMessId(e.target.value)}
              />
            </div>
            <small>Get this ID from your mess manager</small>
          </div>
        )}


          <div className="buttons">
            <button type="submit" disabled={isLoading}>
              <div className="add">
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <img src="/assets/add-user.png" alt="signup" height={20} width={20} />
                    Create Account
                  </>
                )}
              </div>
            </button>
          </div>



        </form>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Singup;