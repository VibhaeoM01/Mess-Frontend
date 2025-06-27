import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest"; // Your axios instance
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nav = useNavigate();

  useEffect(() => { 
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      console.log('Verifying user:', { storedToken, storedUser });
      if (storedToken && storedUser) {
        try {
          const res = await apiRequest.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          console.log('/auth/me response:', res.data);
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (err) {
          console.log("Token invalid or expired", err);
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = (userData, tokenData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", userData.role);
    localStorage.setItem("loggedIn", "true");
    setUser(userData);
    setToken(tokenData);
    setIsAuthenticated(true);
  };

    const logout = () => {
    setLoading(true);  
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("loggedIn");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);  //after 1.2sec this will happenn
      nav("/");
    }, 400); 
  };

  return (
    
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook for context access
export const useAuth = () => useContext(AuthContext);
