import React from "react";
import { AppBar, Toolbar, Typography, TextField, Button, Avatar } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { useUserAuth } from "../context/UserAuthContext";




const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#333",
  },
  platformName: {
    flexGrow: 1,
    fontWeight: "bold",
  },
  searchInput: {
    marginLeft: "auto", // Pushes the search bar to the right
    marginRight: theme.spacing(2),
    "& input": {
      backgroundColor: "#fff",
      borderRadius: 4,
      padding: "8px",
    },
  },
  loginButton: {
    backgroundColor: "#ff6600",
    color: "#fff",
    marginRight: theme.spacing(1),
  },
  sellButton: {
    backgroundColor: "#ff6600",
    color: "#fff",
  },
  logOutButton:{
    backgroundColor: "red",
    color: "#fff",
  }
}));

const Navbar = ({onSellButtonClick} ) => {
  const classes = useStyles();
  const {user, logOut} = useUserAuth();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h3" className={classes.platformName}>
          Becho
        </Typography>
        <TextField
          placeholder="Search..."
          variant="outlined"
          className={classes.searchInput}
        />
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
        {user ? (
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
            <Avatar alt={user.displayName} src={user.photoURL} className={classes.profileIcon} />
            <Typography variant="body1">{user.displayName}</Typography>
          </div>
        ) : (
          <p>Log In First</p>
        )}

        <Button variant="contained" className={classes.sellButton} onClick={onSellButtonClick}>
            Sell
          </Button>
          <Button variant="contained" className={classes.logOutButton} onClick={()=>{logOut()}}>
            Log out
          </Button>
     
          </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
