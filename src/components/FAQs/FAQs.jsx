import { useState } from "react";
import "./fAQ.scss";

const faqData = [
  {
    question: "How do students pre-book meals?",
    answer: "Students can pre-book meals by logging into their account and selecting their meal preferences for the week."
  },
  {
    question: "Can I provide feedback anonymously?",
    answer: "Yes, you can choose to provide feedback anonymously through the feedback form."
  },
  {
    question: "How does MessMaster help reduce food waste?",
    answer: "MessMaster predicts meal demand and helps mess managers prepare the right quantity of food, reducing waste."
  },
  {
    question: "Is the analytics dashboard customizable?",
    answer: "Yes, admins can customize the analytics dashboard to view the data most relevant to them."
  },
  {
    question: "What kind of data is available for admins?",
    answer: "Admins can view meal counts, feedback summaries, and food waste analytics."
  }
];

function FAQs() {
  const [openIndices, setOpenIndices] = useState([]);

  const toggle = (idx) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="Faqs">
  <div className="fAQs">
    <div className="container">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, idx) => (
        <div key={idx} className="faq-card">
          <button onClick={() => toggle(idx)} className="faq">
            <span>{faq.question}</span>
            <span className="logo">{openIndices.includes(idx) ? "▲" : "▼"}</span>
          </button>
          {openIndices.includes(idx) && (
            <div className="ans">{faq.answer}</div>
          )}
          <hr />
        </div>
      ))}
    </div>
  </div>
</section>

  );
}

export default FAQs;