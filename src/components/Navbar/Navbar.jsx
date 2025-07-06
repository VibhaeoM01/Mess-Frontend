import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useSubscribe } from "../../context/SubscribeContext";
import { useToast } from "../../context/ToastContext";
import { useMess } from "../../context/MessContext";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { Subscribed } = useSubscribe();
  const { showLoginSubscriptionToast, showSignupSubscriptionToast } = useToast();
  const { currentMess, subscriptionStatus } = useMess();
  
  console.log(user);
    // Add this debug code right after the user state
  console.log("Navbar - User:", user);
  console.log("Navbar - User role:", user?.role);
  console.log("Navbar - User:", user);
  console.log("Navbar - User messId:", user?.messId);
  console.log("Navbar - User role:", user?.role);
  console.log("Navbar - Should show mess ID display:", user && user.role === 'mess_manager');
  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    // Navigate to home page after logout
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleLogin = () => {
    // Check if user is trying to access features that require mess subscription
    // if (location.pathname === "/" && (!currentMess || !subscriptionStatus.isActive)) {
    //   showLoginSubscriptionToast();
    //   return;
    // }
    handleNav("/login");
  };

  const handleSignup = () => {
    // Check if user is trying to access features that require mess subscription
    // if (location.pathname === "/" && (!currentMess || !subscriptionStatus.isActive)) {
    //   showSignupSubscriptionToast();
    //   return;
    // }
    handleNav("/signup");
  };

  // const handleStudentLogin = () => {
  //   // Navigate to student login page which will include mess ID input
  //   handleNav("/student-login");
  // };
  return (
    <div className="navbar">
      <div className="gola">
        <div className="navbar__logo">
          <Link to="/">
            <img className="logo" src="\assets\logo.png" alt="logo" />{" "}
          </Link>
        </div>
      </div>

      {isHome && (
        <div className="scrolllinks">
          <ScrollLink
            className="scroll"
            to="Features"
            duration={800}
            smooth={true}
          >
            Features
          </ScrollLink>
          <ScrollLink className="scroll" to="Faqs" duration={800} smooth={true}>
            FAQs
          </ScrollLink>
          <ScrollLink
            className="scroll"
            to="contact"
            duration={800}
            smooth={true}
          >
            Contact Us
          </ScrollLink>
        </div>
      )}
     
      {user && user.role === 'mess_manager' && (
  <div className="mess-id-display">
    <div className="mess-id-container">
      <span className="mess-id-label">Mess ID:</span>
      <span className="mess-id-value">{user.messId || 'Not Generated'}</span>
      {user.messId && (
        <button 
          className="copy-mess-id" 
          onClick={() => {
            navigator.clipboard.writeText(user.messId);
            addToast({
              message: 'Mess ID copied to clipboard!',
              type: 'success',
              duration: 2000
            });
          }}
        >
          📋 Copy
        </button>
      )}
    </div>
  </div>
)}
      <div className="buttons">
        {user &&
          user.role === "student" &&
          location.pathname !== "/student" && (
            <button
              className="RedirectButton"  //mess redirect
              onClick={() => handleNav("/student")}
            >
              Student Page
            </button>
          )}
        {user &&
          (user.role === "mess_manager" || user.role === "super_admin") &&
          location.pathname !== "/mess_manager" && (
            <button
              className="RedirectButton "
              onClick={() => handleNav("/mess_manager")}
            >
              Mess Page
            </button>
          )}
        {user ? (
          <>
            <div className="hello">
              <span className="username">
                Hello, <span className="name">{user.name || user.email}</span>
              </span>
              <button className="logout button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button 
              className="login button"
              onClick={handleLogin}
            >
              Login
            </button>
            {/* <button 
              className="student-login button"
              onClick={handleStudentLogin}
            >
              Login as Student
            </button> */}
            <button 
              className="signup button"
              onClick={handleSignup}
            >
              Signup
            </button>
          </>
        )}

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <img src="/assets/menu.png" alt="" />
        </button>
        
<div className={menuOpen ? "slide active" : "slide"}>
  {user &&
    user.role === "student" &&
    location.pathname !== "/student" && (
      <button
        className="StudentRedirectButton1 "
        onClick={() => handleNav("/student")}
      >
        Student Page
      </button>
    )}
  {user ? (
    <>
      <div className="hello1">
        <span className="username1">
          Hello, <span className="name1">{user.name || user.email}</span>
        </span>
        <button className="logout1 button1" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  ) : (
    <div className="harm">
      <button
        className="login button1"
        onClick={handleLogin}
      >
        Login
      </button>
      {/* <button
        className="student-login button1"
        onClick={handleStudentLogin}
      >
        Login as Student
      </button> */}
      <button
        className="signup button1"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default Navbar;
