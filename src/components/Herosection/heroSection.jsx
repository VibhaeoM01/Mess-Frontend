// import "./heroSection.scss";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Import images directly
// import heroImage from '/assets/hero.jpg';
// import image1 from '/assets/hero1.jpg';
// import image2 from '/assets/2.jpg';

// const slides = [
//   {
//     title: "🍽️ Welcome to Your Digital Mess Companion!",
//     description:
//       "Say goodbye to confusion and long queues. View meals, pre-book, and give feedback — all in one click.",
//     image: heroImage,
//   },
//   {
//     title: "📅 Plan Your Meals with Ease",
//     description:
//       "View daily and weekly menus, pre-book your meals before cut-off time, and track food waste.",
//     image: image2,
//   },
//   {
//     title: "📊 Manage Inventory & Feedback Seamlessly",
//     description:
//       "Admins can track meal bookings, monitor food waste, update menus, and manage stocks — all from one dashboard.",
//     image: image1,
//   },
// ];

// function HeroSection() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//   };

//   return (
//     <section id="home">
//       <div className="heroSection">
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div key={index} className="slide">
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className="slide-image"
//               />
//               <div className="content">
//                 <h2>{slide.title}</h2>
//                 <p>{slide.description}</p>
//               </div>
//             </div>
//             {index === 0 && (
//               <div className="hero-buttons">
//                 <a href="https://your-stripe-checkout-link.com" className="subscribe-btn">
//                   Subscribe Now
//                 </a>
//                 <a href="/free-trial" className="trial-btn">
//                   Free Trial
//                 </a>
//               </div>
//             )}
//           ))}
//         </Slider>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;

import "./heroSection.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import images directly
import heroImage from "/assets/hero.jpg";
import image1 from "/assets/hero1.jpg";
import image2 from "/assets/hero2.jpeg";
import { useAuth } from "../../context/AuthContext";
// import { useState } from "react";
// import { useSubscribe } from "../../context/SubscribeContext";

const slides = [
  {
    title: "🍽️ Welcome to Your Digital Mess Companion!",
    description:
      "Say goodbye to confusion and long queues. View meals, pre-book, and give feedback — all in one click.",
    image: heroImage,
  },
  {
    title: "📊 Manage Inventory & Feedback Seamlessly",
    description:
      "Admins can track meal bookings, monitor food waste, update menus, and manage stocks — all from one dashboard.",

    image: image2,
  },
  {
    title: "📅 Plan Your Meals with Ease",
    description:
      "View daily and weekly menus, pre-book your meals before cut-off time, and track food waste.",
    image: image1,
  },
];

function HeroSection() {
  // const { Subscribed, setSubscribed } = useSubscribe(false);
  const { user } = useAuth();
  
  // const handleSubscribe = () => {
  //   setSubscribed(true);
  //   setTimeout(() => setSubscribed(false), 300000); // 5 minutes = 300,000 ms
  //   // Optionally, redirect to payment page:
  //   // window.open("https://buy.stripe.com/test_7sYcN53Z86A19fmbBnfUQ01", "_blank");
  // };
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <section id="home">
      <div className="heroSection">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-image"
              />
              <div className="content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </Slider>
        {/* {!user && (
          <div className="hero-buttons">
            <div
              className="child1"
              onClick={() => (window.location.href = "/free-trial")}
            >
              Free Trial
            </div>

            <div className="child2">
              <a
                href="https://buy.stripe.com/test_7sYcN53Z86A19fmbBnfUQ01"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="Subscribe" onClick={handleSubscribe}>
                 Donate
                </button>
              </a>
            </div>
          </div>
        )} */}
        {(!user || user.role === "mess_manager") && (
          <div className="hero-buttons">
            <div
              className="child3"
              onClick={() => (window.location.href = "/get-mess-id")}
              title="Create a Mess ID (Mess Managers only)"
            >
              Get Mess ID
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
