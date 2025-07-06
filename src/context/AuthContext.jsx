import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest"; // Your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { 
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      console.log('AuthContext - Verifying user:', { storedToken, storedUser });
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext - Parsed user:', parsedUser);
          const res = await apiRequest.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          console.log('AuthContext - /auth/me response:', res.data);
          setUser(parsedUser); // Use stored user data instead of API response for now
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (err) {
          console.log("AuthContext - Token invalid or expired", err);
          logout();
        }
      } else {
        console.log('AuthContext - No stored credentials found');
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
      setLoading(false);  //after 1.2sec this will happen
      // Navigation will be handled by components that call logout
    }, 400); 
  };

  // Function to update user data in context and localStorage
  const updateUser = (updatedUserData) => {
    console.log('AuthContext - Updating user data:', updatedUserData);
    console.log('AuthContext - Current user before update:', user);
    // Update localStorage with new user data
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    // Update context state
    setUser(updatedUserData);
    console.log('AuthContext - User updated successfully');
  };

  return (
    
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook for context access
export const useAuth = () => useContext(AuthContext);
