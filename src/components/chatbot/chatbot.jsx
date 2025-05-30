 
import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const loadedRef = useRef(false);  

  useEffect(() => {
    if (!loadedRef.current) {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = resolve;
          document.body.appendChild(script);
        });

      loadScript("https://cdn.botpress.cloud/webchat/v2.5/inject.js")
        .then(() =>
          loadScript(
            "https://files.bpcontent.cloud/2025/05/28/11/20250528112827-2ET9JNZV.js"
          )
        )
        .then(() => { 
         const waitForBotpress = () => {
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: "show" });
    } else {
      setTimeout(waitForBotpress, 100);
    }
  };
  waitForBotpress();
});

      loadedRef.current = true;
    }
 
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({
        type: open ? "show" : "hide",
      });
    }
  }, [open]);

  return (
    <div className="page"> 
    </div>
  );
}

