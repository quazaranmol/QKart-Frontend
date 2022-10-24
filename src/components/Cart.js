import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData=[], productsData=[]) => {
  // console.log("Cart",cartData);
  // console.log("products",productsData);
  // const cartItemDetails = productsData.filter((product)=>{
  //   return cartData.find((dataValue)=>{
  //     return product._id===dataValue.productId
  //   })
  // })
  const cartItemDetails = [];
  productsData.forEach((product)=>{
    cartData.forEach((cartItem)=>{
      if(product._id===cartItem.productId){
        cartItemDetails.push({...product , qty:cartItem.qty})
      }
    })
  })
  // cartData.forEach((item,index)=>{
  //   cartItemDetails[index].qty = item.qty;
  //   // console.log("This is updater function",item.productId,item.qty)
  // })
  // console.log("cartDetails",cartItemDetails);
  return cartItemDetails;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  if(items.length === 0) return 0;
  let totalCartValue=0;
  items.forEach((item)=>{
    totalCartValue += item.cost*item.qty;
  })
  return totalCartValue;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */


const OrderDetails =({items})=>{
  const {products, subtotal, shippingCharges, total} = getTotalItems(items);
  return(
  <>
  <Stack direction="column" alignItems="left">
    <Typography variant="h6" sx={{ fontWeight: 'bold', m: 1  }} >Order Details</Typography>
      <Stack direction="row" justifyContent="space-between" sx={{ m: 1  }}>        
        <Typography variant="div" alignItems="left">Products</Typography>
        <Typography variant="div" alignItems="right">{products}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ m: 1  }}>        
        <Typography variant="div" alignItems="left">Subtotal</Typography>
        <Typography variant="div" alignItems="right">${subtotal}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ m: 1  }} >        
        <Typography variant="div" alignItems="left">Shipping Charges</Typography>
        <Typography variant="div" alignItems="right">${shippingCharges}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ fontWeight: 'bold', m:1 }}>        
        <Typography variant="div" alignItems="left">Total</Typography>
        <Typography variant="div" alignItems="right">${total}</Typography>
      </Stack>
  </Stack>
  </>
  )
}


export const getTotalItems = (items = []) => {
  const totalValues = {
    products: items.length,
    subtotal: getTotalCartValue(items),
    shippingCharges:0
  }
  totalValues.total = totalValues.subtotal + totalValues.shippingCharges;
  return totalValues;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */

const CartItem = ({item, handleChange, isReadOnly})=>{
  // console.log(handleChange);
  return(
    <Box display="flex" alignItems="flex-start" padding="1rem">
    <Box className="image-container">
        <img
            // Add product image
            src={item.image}
            // Add product name as alt eext
            alt={item.name}
            width="100%"
            height="100%"
        />
    </Box>
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
    >
        <div>{item.name}</div>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
        <ItemQuantity
        // Add required props by checking implementation
        handleQuantity={handleChange}
        value={item}
        isReadOnly={isReadOnly}
        />
        <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
        </Box>
        </Box>
    </Box>
</Box>
  )
}

const ItemQuantity = ({
  value,
  handleQuantity,
  isReadOnly = false,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      {isReadOnly? (
        <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value.qty}
      </Box>
      ):(
        <>
      <IconButton size="small" color="primary" onClick={(event)=>{handleQuantity(
        "-",
        value._id,
        value.qty-1
      )}}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value.qty}
      </Box>
      <IconButton size="small" color="primary" onClick={(event)=>{
        // console.log("This is element","name=",value.name,"id=",value._id,"qty=",value.qty)
        handleQuantity(
          "+",
          value._id,
          value.qty+1
        )}} >
        <AddOutlined />
      </IconButton>
      </>
      )
      }
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */


const Checkout = ()=>{
  const history = useHistory();

  return (
    <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>history.push("/checkout")}
          >
            Checkout
          </Button>
          {/* <Button value="hello" onClick={handleQuantity} >TEST</Button> */}
        </Box>
  )
}


const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  // console.log(handleQuantity)
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map((item)=><CartItem isReadOnly={isReadOnly} item={item} key={item._id} handleChange={handleQuantity} />)}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {isReadOnly? <OrderDetails items={items} /> : <Checkout />}
      </Box> 
    </>
  );
};

export default Cart;
