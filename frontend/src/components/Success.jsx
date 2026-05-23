const Successful = ({ text }) => {
  return (
    <article id="success_message">
      <div className="my_message">
        <h6> {text} </h6>

      </div>
      <div class="progress-container">
        <div class="progress-bar"></div>
      </div>
    </article>
  );
};

export default Successful