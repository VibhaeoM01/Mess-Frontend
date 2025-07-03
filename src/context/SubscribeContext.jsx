import { createContext, useContext, useState } from "react";

const SubscribeContext = createContext();

export function SubscribeProvider({ children }) {
  const [Subscribed, setSubscribed] = useState(false);
  return (
    <SubscribeContext.Provider value={{ Subscribed, setSubscribed }}>
      {children}
    </SubscribeContext.Provider>
  );
}

export function useSubscribe() {
  return useContext(SubscribeContext);
}
