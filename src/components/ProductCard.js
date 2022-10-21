import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Grid,
  Typography
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
      <Card className="card">
        <Card 
        sx={{ maxWidth: 345, }}
        >
          <CardMedia
            component="img"
            // height="140"
            image={product.image}
            height="auto"
            alt={product.name}
            aria-label={product._id}
          />
          <CardContent>
            <Typography variant="h6" component="div" sx={{height:80}}>
              {product.name}
            </Typography>
            <Typography variant="h5" component="div">
              ${product.cost}
            </Typography>
            <Rating
              name="half-rating"
              value={product.rating}
              readOnly
            />
          </CardContent>
          <CardActions>
          <Button
          variant="contained"
          value={product._id}
          className="card-button productCard"
          onClick={(event)=>{handleAddToCart(
            "productCard",
            product._id
            )}}
          name="productCard"
          >
            <AddShoppingCartOutlined
              fontSize="inherit"
            />{" "}
            ADD TO CART
          </Button>
          </CardActions>
        </Card>
      </Card>
  );
};

export default ProductCard;
