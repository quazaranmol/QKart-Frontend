import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Item, TextField, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import "./Header.css";
import { useHistory, Link, Route } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}

      {hasHiddenAuthButtons ? (
        <Button
          onClick={() => {
            history.push("/");
          }}
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to explore
        </Button>
      ) : localStorage.getItem("token") !== null ? (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
          <div className="username">{localStorage.getItem("username")}</div>
          <Button
            onClick={() => {
              localStorage.clear();
              history.push("/");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <div>
          <Button
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </Button>{" "}
          <Button
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </Button>{" "}
        </div>
      )}
    </Box>
  );
};

export default Header;
