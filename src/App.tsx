import React, { useEffect } from "react";
import Router from "./routes";
import { DarkModeProvider } from "./context/DarkModeContext";
import CookieConsentSystem from "./components/Cookies";
import { initializeStores } from "./utils/storeInitializer";

const App: React.FC = () => {
  useEffect(() => {
    // Store'ları uygulama başlangıcında initialize et
    initializeStores();
  }, []);

  return (
   <DarkModeProvider>
      <Router />
      <CookieConsentSystem />

   </DarkModeProvider>
  );
};

export default App;
