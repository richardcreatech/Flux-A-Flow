import React from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faCompass } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import "../../styles/products.css";

function SingleMarket() {
  const { id } = useParams();
  return (
    <main id="current_market">
      <section id="about_marketPlace">
        <div id="my_market_info">
          <span id="my_market_logo">P</span>
          <div id="market_text">
            <h2>My Market</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet!
            </p>
          </div>
        </div>

        <div id="gen_market_info">
          <div id="no_of_prods">
                      <span className="stat_icon">
                          <FontAwesomeIcon icon={faBagShopping} />
            </span>

            <h3>3000</h3>
            <p>Products</p>
            <p>Total in Market</p>
          </div>

          <div id="my_market_panel">
            <button>Add Product</button>
            <button>Delete Market</button>
          </div>
        </div>
      </section>

      <section id="all_products">
        <header>
          <span id="search_prod">
            <FontAwesomeIcon icon={faCompass} />
            <input type="text" name="" placeholder="Search Products" />
          </span>
        </header>

        <main id="products_in_my_market">
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <article className="product">
            <img
              src={
                "https://i.pinimg.com/736x/d4/90/2c/d4902caa07f0fe97eff081f27ae8fb53.jpg"
              }
              alt=""
              width={50}
            />
            <div className="product_info">
              <h2>Product</h2>
              <p>$300</p>

              <label htmlFor="">
                <small>Quantity</small>
                <input type="number" />
              </label>

              <div className="product_buttons">
                <button>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faAdd} />
                  <p>Add Products</p>
                </button>
              </div>
            </div>
          </article>
          <canvas></canvas>
        </main>
      </section>
    </main>
  );
}

export default SingleMarket;
