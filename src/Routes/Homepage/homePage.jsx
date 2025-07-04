import { useState, useEffect } from "react";
import Chatbot from "../../components/chatbot/chatbot";
import Contactusform from "../../components/ContactUs/contactusform";
import FAQs from "../../components/FAQs/FAQs";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/Herosection/heroSection";
import Impact from "../../components/Impact/impact";
import ShowCard from "../../components/ShowcaseCards/ShowCard";
import "./homePage.scss";

function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);  
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loadingscreen">
        <img src="/assets/logo.png" alt="Loading..." />
        Loading...
      </div>
      </div>
    );
  }

  return (
    <div className="homePage">
  <div className="image">
  <img src="/assets/home1left.png" alt="" />
  </div>
  <div className="image1">
  <img src="/assets/home1right.png" alt="" />
  </div>
  {/* <div className="image2">
    <img src="/assets/home2left.png" alt="" />
  </div> */}
      <Chatbot />
      <HeroSection />
      <ShowCard />
      <Impact />
      <Contactusform />
      <FAQs />
      {/* <Footer /> */}
    </div>
  );
}

export default HomePage;