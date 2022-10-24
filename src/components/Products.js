import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Cart from "./Cart.js";
import { generateCartItemsFrom } from "./Cart.js";
import { useHistory } from "react-router-dom";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [searchValue, updateSearchValue] = useState("");
  const [searchDataIsEmpty, updateSearchDataisEmpty] = useState(false);
  const [timerID, setTimerID] = useState(null);
  const [cart, updateCart] = useState([]);
  const history = useHistory();
  let cartItemsVariable = [];

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      let response = {};
      if (searchValue) {
        response = await axios(
          `${config.endpoint}/products/search?value=${searchValue}`
        );
      } else {
        response = await axios(`${config.endpoint}/products`);
      }
      updateSearchDataisEmpty(false);
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        updateSearchDataisEmpty(true);
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running and reachable.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event) => {
    if (timerID) {
      clearTimeout(timerID);
    }
    const debounceTimeout = setTimeout(() => {
      performAPICall();
    }, 500);
    setTimerID(debounceTimeout);
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/cart`, 
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
      );
      updateCart(response.data);
    } catch (error) {
      enqueueSnackbar(`Oops! ${error}`, { variant: "error" });
    }

  //   if(cart){
  //   console.log("CARTVALUES");
  //   cart.forEach((item) => {
  //     console.log(`Name = ${item.name} ID= ${item._id} Quantity = ${item.qty}`);
  //   });
  //   console.log("CARTVALUES");
  // }
  };

  // const product = {
  //   name: "Tan Leatherette Weekender Duffle",
  //   category: "Fashion",
  //   cost: 150,
  //   rating: 4,
  //   image:
  //     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   _id: "PmInA797xJhMIPti",
  // };

  const addToCart = async (
    passedFrom,
    productId,
    currentValue = 1,
  ) => {
    if (!localStorage.getItem("token")) {
      enqueueSnackbar(
        "You are not Logged in. Please Log in to add products to cart.",
        { variant: "warning" }
      );
      history.push("/login");
      return;
    }
    if (passedFrom === "productCard") {
      if (
        cartItemsVariable.find((cartItem) => {
          return cartItem._id === productId;
        })
      ) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
        return;
      }
    } 

    try {
      let response = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: currentValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // fetchCart();
      updateCart(response.data);
      // console.log("UPDATED CART : " , response.data);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if(products.length>0 && cart.length>0 ){
    cartItemsVariable = generateCartItemsFrom(cart,products);
    }

  useEffect(() => {
    if (localStorage.getItem("token") && !searchValue && products) fetchCart();
  }, [products]);

  useEffect(() => {
    performAPICall();
    // if(localStorage.getItem("token"))
    //   fetchCart();
  }, []);

  useEffect(() => {
    debounceSearch();
  }, [searchValue]);

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search search-desktop"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          value={searchValue}
          onChange={(e)=>{updateSearchValue(e.target.value);}}
          name="search"
        />
      </Header>

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchValue}
        onChange={(e)=>{updateSearchValue(e.target.value);}}
      />
      <Grid container>
        {/* {localStorage.getItem("token") !== null? <Grid item xs={12} md={8}> : <Grid item xs={12} md={12}> } */}
        <Grid item xs={12} md={localStorage.getItem("token") ? 8 : 12}>
          <Grid key="hero" item xs={12} md={12} className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          <Grid container item>
            {searchDataIsEmpty ? (
              <Typography className="loading">
                <SentimentVeryDissatisfiedIcon />
                No products found
              </Typography>
            ) : products.length!==0 ? (
              products.map((product) => (
                <Grid
                  item
                  className="product-grid"
                  xs={6}
                  md={3}
                  key={product._id}
                >
                  <ProductCard product={product} handleAddToCart={addToCart} />
                </Grid>
              ))
            ) : (
              <Typography className="loading">
                <CircularProgress color="inherit" />
                <Typography>Loading Products</Typography>
              </Typography>
            )}
          </Grid>
        </Grid>
        {localStorage.getItem("token") && (
          <Grid item xs={12} md={4}>
            <Cart items={cartItemsVariable} handleQuantity={addToCart} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
