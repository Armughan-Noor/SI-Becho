import React from "react";
import { Button, Container, TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../context/UserAuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";



const useStyles = makeStyles((theme) => ({
  card: {
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "400px",
    margin: "0 auto",
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

const AdForm = ({onCancelButtonClick}) => {
  const classes = useStyles();
  const { user } = useUserAuth();
  var imagePath="";


  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").positive().integer(),
    photo: Yup.mixed().required("Photo is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      photo: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        //setting adPhoto metadata
        if (values.photo) {
          const metadata = {
            contentType: "image/png",
          };
        
        //creating refrence for profile images to be stored for new users
        const storageRef = ref(storage, "ads/" + values.photo.name);
        const uploadTask = uploadBytesResumable(
          storageRef,
          values.photo,
          metadata
        );
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                break;
              case "storage/canceled":
                break;
              case "storage/unknown":
                break;

              default:
                break;
            }
          },
          async () => {
            // Upload completed successfully, now we can get the download URL
            await getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("Download url is " + downloadURL);
                imagePath = downloadURL; //storing image path for further use
                console.log("File available at " + imagePath);
              }).then( async() => {
                //creating an object to store signed up users info in the firebase database(users collection)
                const adInfo = {
                  title: values.title,
                  description: values.description,
                  price: values.price,
                  photoPath: imagePath,
                  userID: user.uid,
                };
                try{
                  await addDoc(collection(db, "Ads"), adInfo); //creating new document
                  console.log("Ad added");
                  onCancelButtonClick();
                }catch(err){
                  console.log("Error in adding the ads");
                }

               
                
              });
          }
        )
      }
      
      } catch (err) {
        console.log("New Error",err.message);
      }
    },
  });

  return (
    <Container>
      <Card className={classes.card}>
        <Card.Body>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classes.formField}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classes.formField}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classes.formField}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => formik.setFieldValue("photo", e.target.files[0])}
              className={classes.formField}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "green" }}
              >
                Create Ad
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "red" }}
                type="button"
                onClick={onCancelButtonClick}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdForm;
