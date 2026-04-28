import React, { useState } from "react";
import showcaseData from "./messages/showcaseData";

function AuthShowcase() {
  const [index, setIndex] = useState(0);

  const current = showcaseData[index];

  return (
    <div className="auth-showcase">
          <div className="overlay-content">
              
              <div className="carousel">
                  
        <div
          className="carousel-track"
      
        >
          <h2>{current.title}</h2>
          <p>{current.description}</p>
        </div>
              </div>

        <div className="carousel-dots">
          {showcaseData.map((_, i) => (
            <span
              key={i}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthShowcase;
