import { useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log(user);
  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };
  return (
    <div className="navbar">
      <div className="gola">
        <div className="navbar__logo">
          <Link to="/">
            <img className="logo" src="\assets\logo.png" alt="logo" />{" "}
          </Link>
        </div>
      </div>

      {!user && (
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
     {!user &&
      <a href="https://buy.stripe.com/test_7sYcN53Z86A19fmbBnfUQ01" target="_blank" rel="noopener noreferrer">
      <button className="Subscribe">Subscribe Now</button>
    </a>
     }

      <div className="buttons">
        {user &&
          user.role === "student" &&
          location.pathname !== "/student" && (
            <button
              className="StudentRedirectButton "
              onClick={() => handleNav("/student")}
            >
              Student Page
            </button>
          )}
        {user &&
          (user.role === "mess_manager" || user.role === "super_admin") &&
          location.pathname !== "/mess_manager" && (
            <button
              className="StudentRedirectButton "
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
              <button className="logout button" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className="login button"
              onClick={() => handleNav("/login")}
            >
              Login
            </button>
            <button
              className="signup button"
              onClick={() => handleNav("/signup")}
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
        <button className="logout1 button1" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  ) : (
    <div className="harm">
      <button
        className="login button1"
        onClick={() => handleNav("/login")}
      >
        Login
      </button>
      <button
        className="signup button1"
        onClick={() => handleNav("/signup")}
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
