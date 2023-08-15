import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import {
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel"; // Corrected import
import SmsIcon from "@mui/icons-material/Sms";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@material-ui/core/styles";
import { useUserAuth } from "../context/UserAuthContext";
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    height: "400px",
  },
  chatArea: {
    flexGrow: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
  },
  chatInput: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

const AdsDisplay = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");
  const [postOwner, setPosrtOwner] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const { user } = useUserAuth();
  const classes = useStyles();
  const chatQueryRef = useRef(null);



  
  const loadChatMessages = async (senderId, receiverId) => {
  try {
    const chatCollectionRef = collection(db, "Chats");

    const currentTimestamp = new Date();
    const yesterdayTimestamp = new Date();
    yesterdayTimestamp.setDate(yesterdayTimestamp.getDate() - 1);

    const querry = query(
      chatCollectionRef,
      where("sender", "in", [senderId, receiverId]),
      where("receiver", "in", [senderId, receiverId]),
      where("timestamp", ">=", yesterdayTimestamp),
      where("timestamp", "<=", currentTimestamp),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(querry);
    const messages = querySnapshot.docs.map((doc) => doc.data());
    setChatMessages(messages);

    // Subscribe to real-time changes using onSnapshot
    const unsubscribe = onSnapshot(querry, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => doc.data());
      setChatMessages(updatedMessages);
      
    });

    // Store the unsubscribe function to call later when needed (component unmount, etc.)
    // This prevents memory leaks by unsubscribing from real-time updates when no longer needed
    return unsubscribe;
  } catch (error) {
    console.error("Error loading chat messages:", error);
  }
};



  useEffect(() => {
    const fetchAds = async () => {
      
      try {
        const adsCollectionRef = collection(db, "Ads");
        const querySnapshot = await getDocs(adsCollectionRef);
        const adsData = querySnapshot.docs.map((doc) => doc.data());
        setAds(adsData);
        
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
      finally{
        setAdsLoading(false);
      }
      if (ads.length > 0) {
        // const firstAd = ads[0];
        chatQueryRef.current = loadChatMessages(user.uid, selectedAd.userID); // Store the query reference
        
      }
    };
  
    fetchAds();
  }, [user.uid, ads, selectedAd]);
  

  useEffect(() => {
    if (chatQueryRef.current) {
      const unsubscribe = chatQueryRef.current; // Get the stored query reference

      return () => {
        unsubscribe();
      };
    }
  }, []);

  
  const handleAdClick = (ad) => {
    setSelectedAd(ad);
    const fetchUserByUID = async (uid) => {
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, uid); // Use UID as the document ID

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userDocument = userDocSnapshot.data();
          setPosrtOwner(userDocument.name);
        } else {
          console.log("No user found with the given UID.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // Call this function with the user's UID
    fetchUserByUID(ad.userID);
    
  };

  const handleSendMessage = async () => {
    if (user.uid !== selectedAd.userID) {
      if (newMessage.trim() !== "") {
        const messageData = {
          sender: user.uid, // Replace with the current user's ID
          receiver: selectedAd.userID,
          message: newMessage,
          timestamp: serverTimestamp(),
        };

        // Save the message to Firestore
        console.log("New Message Information: ", messageData);
        await addDoc(collection(db, "Chats"), messageData);
        // await loadChatMessages(user.uid, selectedAd.userID);
        // Clear the input field
        setNewMessage("");
      }
    } else {
      console.log("Can't send message to yourself ");
    }
  };

  const handleChat = () => {
    setOpenChat(true);
  };
  const handleCloseDialog = () => {
    setSelectedAd("");
  };

  return (
    <div>
      {adsLoading ? (
        <CircularProgress/>
      ): (<>
      <Grid container spacing={3}>
        {ads.map((product, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            md={4}
            style={{ display: "flex", cursor: "pointer" }}
            onClick={() => handleAdClick(product)}
          >
            <Paper
              elevation={3}
              style={{
                padding: "10px",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 1,
                  marginBottom: "10px",
                  maxHeight: "200px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.photoPath}
                  alt={product.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <Typography variant="h6">{product.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                ${product.price}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                UserID: {product.userID}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedAd}
        onClose={handleCloseDialog}
        maxWidth="400px"
        
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography
                variant="body1"
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
                {postOwner}
              </Typography>
              <IconButton
                aria-label="close"
                style={{ color: "rgba(144, 238, 144, 2)" }}
                onClick={handleChat}
              >
                <SmsIcon />
              </IconButton>
            </div>
            <div>
              <IconButton
                aria-label="close"
                style={{ color: "red" }}
                onClick={handleCloseDialog}
              >
                <CancelIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedAd && (
            <div>
              <img
                src={selectedAd.photoPath}
                alt={selectedAd.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />

              <Typography
                variant="body1"
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
                {selectedAd && selectedAd.title}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {selectedAd.description}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            style={{ color: "white", backgroundColor: "red" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openChat} onClose={handleCloseDialog} maxWidth="mx" fullWidth>
        <DialogTitle>
          Chat with {postOwner}
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              setOpenChat(false);
            }}
          >
            <CloseIcon style={{ color: "red" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.chatArea}>
            <List>
              {chatMessages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{message.sender[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      message.sender === user.uid ? "You" : postOwner
                    } // Assuming senderId is the current user's ID
                    secondary={message.message}
                  />
                </ListItem>
              ))}
            </List>
          </div>

          <div className={classes.chatInput}>
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton>
              <SendIcon
                style={{ color: "green" }}
                onClick={handleSendMessage}
              />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
};

export default AdsDisplay;
