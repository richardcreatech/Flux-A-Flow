import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faClose,
  faCompass,
  faGridHorizontal,
  faGridVertical,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import "../../styles/products.css";

function SingleMarket() {
  const create_a_prod = useRef(null);
  const { id } = useParams();
  const [market_name, set_market_name] = useState("")
  const [market_des, set_market_des] = useState("")
  const [my_products, set_my_products] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [product_name, setProductName] = useState("");
  const [product_price, setProductPrice] = useState("");
  const [product_quantity, setProductQuantity] = useState("");
  const [product_image_url, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setImageUrl(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", product_name);
    formData.append("price", product_price);
    formData.append("quantity", product_quantity);
    formData.append("imageURL", product_image_url);

    const res = await fetch(
      `http://localhost:5000/auth/marketplace/${id}/product`,

      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await res.json();
    location.reload();
    console.log(data);
  };

  const loadProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/auth/marketplace/${id}/products`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    set_market_name(data.title)
    set_market_des(data.desc);
    set_my_products(data.products);
  };

  const show_pop_up = () => {
    create_a_prod.current.classList.toggle("show");
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main id="current_market">
      <section id="create_a_product" ref={create_a_prod}>
        <form action="" onSubmit={addProduct}>
          <span onClick={show_pop_up}>
            <FontAwesomeIcon icon={faClose} />
          </span>
          <div id="my_product_image_upload">
            {preview && <img src={preview} alt="Preview" />}

            <label htmlFor="product_upload" className="upload_box">
              Click to upload image
            </label>

            <input
              id="product_upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div id="my_product_info_typed">
            <input
              type="text"
              placeholder="Product Name"
              value={product_name}
              onChange={(e) => setProductName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Product Price"
              value={product_price}
              onChange={(e) => setProductPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Product Quantity"
              id="product_quantity"
              value={product_quantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <button id="create_this_prod" type="submit">
            Create this Product
          </button>
        </form>
      </section>

      <section id="about_marketPlace">
        <div id="my_market_info">
          <span id="my_market_logo">{market_name[0]}</span>
          <div id="market_text">
            <h2>{market_name}</h2>
            <p>
              {market_des}
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
            <button onClick={show_pop_up}>Add Product</button>
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

          <span id="view_switch">
            <FontAwesomeIcon icon={faGridVertical} />
            <FontAwesomeIcon icon={faList} />
          </span>
        </header>

        {my_products?.length == 0 && (
          <main id="empty_market">
            <p>No Market</p>
          </main>
        )}

        {my_products?.length != 0 && (
          <main id="products_in_my_market">
            {my_products.map((i) => (
              <article className="product">
                <img
                  src={i["imageURL"]}
                  alt=""
                  width={50}
                />
                <div className="product_info">
                  <h2>{i["name"]}</h2>
                  <p>{i["price"]}</p>

                  <label htmlFor="">
                    <small>Quantity</small>
                    <small>{i["quantity"]}</small>
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
            ))}
            <canvas></canvas>
          </main>
        )}
      </section>
    </main>
  );
}

export default SingleMarket;
