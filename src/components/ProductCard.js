import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <div>
      <Card className="card">
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            // height="140"
            image={product.image}
            height="auto"
            alt={product.name}
            aria-label={product.__id}
          />
          <CardContent>
            <Typography variant="h6" component="div">
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
            className="card-button"
          >
            <AddShoppingCartOutlined
              fontSize="inherit"
            />{" "}
            ADD TO CART
          </Button>
          </CardActions>
        </Card>
      </Card>
    </div>
  );
};

export default ProductCard;
