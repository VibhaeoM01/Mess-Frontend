import { useState, useEffect } from "react";
import apiRequest from "./apiRequest";

export default function useMenuData() {
  const [menus, setMenus] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const [todayRes, allRes] = await Promise.all([
          apiRequest.get("/menus", config),
          apiRequest.get("/menus/all", config),
        ]);
        setMenus(todayRes.data);
        setAllMenus(allRes.data);
      } catch (err) {
        setError("Failed to fetch menus");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  return { menus, allMenus, loading, error };
} 