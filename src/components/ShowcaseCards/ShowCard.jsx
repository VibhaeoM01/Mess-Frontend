import "./showCard.scss";

function ShowCard() {
  const data = [
    { c:"1",d: "View Menu", desc: "Easily browse daily and weekly meals" },
    {
      c:"2",
      d: "Pre-book Meals",
      desc: "Reserve your spot for upcoming meals to ensure availability and reduce waste",
    },
    {
      c:"3",
      d: "Give Feedback",
      desc: "Share your thoughts and suggestions on meals and services instantly"
    },
  ];
  return (
    <section id="features" className="main">
        <div className="heading">Features</div>
      <div className="showCard">
        {data.map((item, key) => (
          <div className="grids" key={key}>
            <div className="numbers">{item.c}</div>
            <div className="card-title">{item.d}</div>
            <div className="card-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShowCard;