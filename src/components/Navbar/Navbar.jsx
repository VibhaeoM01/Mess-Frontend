import { useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();  
  const { user, logout } = useAuth(); 
   console.log(user);
  return (
    <div className="navbar">
      <div className="gola">
        <div className="navbar__logo">
        
        <Link to="/"><img className="logo" src="\assets\logo.png" alt="logo"/> </Link>
      </div>
      </div>
      {!user && <div className="scrolllinks">
        <ScrollLink className="scroll" to="Features" duration={800} smooth={true}>Features</ScrollLink>
        <ScrollLink className="scroll" to="Faqs" duration={800} smooth={true}>FAQs</ScrollLink>
        <ScrollLink className="scroll" to="contact" duration={800} smooth={true}>Contact Us</ScrollLink>
      </div>

      }
          
     <div className="buttons">
       {user && user.role === "student"  && location.pathname !== "/student" && (
        <button className="StudentRedirectButton" onClick={() => navigate("/student")}>Student Page</button>
      )}
        {user ? (
          <>
            <div className="hello">
              <span className="username">Hello, <span className="name">{user.name || user.email}</span></span>
            <button className="logout" onClick={logout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
