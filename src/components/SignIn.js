import React, { useState } from "react";
import { useFormik } from "formik";
import {Link, useNavigate} from 'react-router-dom'
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useUserAuth } from "../context/UserAuthContext";
import { Alert } from "react-bootstrap";



const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  maxWidth: "400px",
  flex: '1',
  gap: '10px',
  padding: '2%', 
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
  borderRadius: '10px',
  fontFamily: 'Montserrat, sans-serif'

});

const LoginForm = () => {
  const {signIn} = useUserAuth();
  const [error, setError] = useState();
  const navigate = useNavigate();


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async(values) => {
      setError("");
      try{
        await signIn(values.email, values.password);
      navigate("/home");
      }
      catch(err)
      {
        setError(err.message);
      }
    },
  });

  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10% 1%',

    }}>
      <FormContainer onSubmit={formik.handleSubmit}>
        <h2 style={{
          margin: "0px",
          padding: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 'bolder', fontSize: '2em',
          fontFamily: 'Roboto Slab, serif',
          }}>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputLabelProps={{
              style: { fontFamily: 'Montserrat, sans-serif', }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: 'Montserrat, sans-serif', }, // Change border color of input element
            }}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputLabelProps={{
              style: { fontFamily: 'Montserrat, sans-serif', }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: 'Montserrat, sans-serif', }, // Change border color of input element
            }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          style={{backgroundColor: 'orange'}}
        >
          Login
        </Button>
        <div>
        Do you have an account? <Link to="/signup">Sign up</Link>
      </div>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
