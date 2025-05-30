import "./heroSection.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    title: "🍽️ Welcome to Your Digital Mess Companion!",
    description: "Say goodbye to confusion and long queues. View meals, pre-book, and give feedback — all in one click.",
    image: "/assets/hero.jpg"
  },
  {
    title: "📅 Plan Your Meals with Ease",
    description: "View daily and weekly menus, pre-book your meals before cut-off time, and track food waste.",
    image: "/assets/1.jpg"
  },
  {
    title: "📊 Manage Inventory & Feedback Seamlessly",
    description: "Admins can track meal bookings, monitor food waste, update menus, and manage stocks — all from one dashboard.",
    image: "/assets/2.jpg"
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
          <div className="slide" key={index} style={{backgroundImage:"/public/assets/hero.jpg"}}
          >
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
          </div>
        ))}
      </Slider>
    </div>
    </section>
  );
}

export default HeroSection;
