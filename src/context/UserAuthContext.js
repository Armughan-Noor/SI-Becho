import { createContext, useContext, useEffect, useState } from "react";
import {
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import {  doc, setDoc } from "firebase/firestore";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  var imagePath = "";
  const [user, setUser] = useState("");

  async function signUp(values) {
    const { name: displayName, profilePhoto } = values;

    try {
      const userRes= await createUserWithEmailAndPassword(auth, values.email, values.password); 
      //create user in authentication state using email and password
      await updateProfile(auth.currentUser, { displayName }); //updating user displayName using provided name

      //setting profilePhoto metadata
      if (profilePhoto) {
        const metadata = {
          contentType: "image/png",
        };

        //creating refrence for profile images to be stored for new users
        const storageRef = ref(storage, "images/" + profilePhoto.name);
        const uploadTask = uploadBytesResumable(
          storageRef,
          profilePhoto,
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
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
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
              })
              .then(async () => {
                try{
                  await updateProfile(auth.currentUser, { photoURL: imagePath }); //updaitng users profile image
                  console.log("Profile Picture Uploaded");
                }
                catch(err){
                  console.log("Profile Picture not updated");
                }
              })
              .then(async () => {
                try {
                  //creating an object to store signed up users info in the firebase database(users collection)
                  const userInfo = {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    gender: values.gender,
                    dob: values.dob,
                    country: values.country,
                    imageURL: imagePath,
                  };
                  await setDoc(doc(db, 'users', userRes.user.uid), userInfo);
                  console.log("User Info ", user);
                } catch (err) {
                  console.log("User not added", err);
                }
              });
          }
        );
       
      }
      return true;
    } catch (err) {
      console.error("Error setting name and profile photo:", err);
      return false; // Update failed
    }
  }

  function logOut() {
    return signOut(auth);
  }
  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // console.log(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logOut, signIn, signUp }}>
      {" "}
      {children}{" "}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
