import "./showCard.scss";

function ShowCard() {
  const data = [
    { clr:"rgb(255, 159, 159)",c:"/assets/menufood.png",d: "View Menu", desc: "See today's and weekly meals" },
    {
      clr:" rgb(169, 211, 235)",
      c:"/assets/book2.png",
      d: "Pre-book Meals",
      desc: "Reserve meals in advance, avoid waste",
    },
    {
      clr:"green",
      c:"/assets/feedback.png",
      d: "Give Feedback",
      desc: "Share quick feedback on food & service"
    },
  ];
  return (
    <section id="features" className="main">
        <div className="heading">Features</div>
      <div className="showCard">
        {data.map((item, key) => (
          <div className="grids" key={key}>
            <div className="numbers" style={{ background: item.clr }}>
              <img src={item.c} alt="" />
            </div>
            <div className="card-title">{item.d}</div>
            <div className="card-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShowCard;