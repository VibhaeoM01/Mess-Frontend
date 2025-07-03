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
        <div
          className="hero-buttons"
          onClick={() => (window.location.href = "/free-trial")}
        >
          Free Trial
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
