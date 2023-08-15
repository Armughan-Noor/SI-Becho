import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
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
  flex: "1",
  gap: "10px",
  padding: "2%",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
  borderRadius: "10px",
});

const SignUpForm = () => {
  const { signUp } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "", // New field for gender
      dob: "", // New field for date of birth
      country: "", // New field for country
      acceptTerms: false, // New field for accepting terms and conditions
      profilePhoto: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
      gender: Yup.string().required("Required"), // Validation for gender field
      dob: Yup.date().required("Required"), // Validation for date of birth field
      country: Yup.string().required("Required"), // Validation for country field
      acceptTerms: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      ), // Validation for accepting terms and conditions checkbox
      profilePhoto: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      setError("");

      try {
        const signUpRes= await signUp(values);
        if(signUpRes)
        {
          navigate("/");
        }
        else{
          navigate("/signup")
        }
        
      } catch (err) {
        setError(err.message);
      }
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10% 1%",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <FormContainer onSubmit={formik.handleSubmit}>
        <h2
          style={{
            margin: "0px",
            padding: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bolder",
            fontSize: "2em",
            fontFamily: "Roboto Slab, serif",
          }}
        >
          Sign Up
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            InputLabelProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
            }}
          />
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
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
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
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
            }}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputLabelProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
            }}
          />
          {/* Gender Radio Buttons */}
          <div>
            <label style={{ fontFamily: "Montserrat, sans-serif" }}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formik.values.gender === "male"}
                onChange={formik.handleChange}
              />
              Male
            </label>
            <label style={{ fontFamily: "Montserrat, sans-serif" }}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formik.values.gender === "female"}
                onChange={formik.handleChange}
              />
              Female
            </label>
          </div>
          {/* Date of Birth */}
          <TextField
            fullWidth
            id="dob"
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
            InputLabelProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
            }}
          />
          {/* Country Dropdown */}
          <TextField
            fullWidth
            id="country"
            name="country"
            select
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country && formik.errors.country}
            SelectProps={{
              native: true,
              style: {
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f2f2f2",
                },
              },
            }}
            InputLabelProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of label
            }}
            inputProps={{
              style: { fontFamily: "Montserrat, sans-serif" }, // Change border color of input element
            }}
          >
            <option value="" disabled>
              Select Country
            </option>
            <option
              value="pakistan"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Pakistan
            </option>
            <option
              value="india"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              India
            </option>
            <option
              value="bangladesh"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Bangladesh
            </option>
            <option
              value="usa"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              USA
            </option>
            <option
              value="australia"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Australis
            </option>
            <option
              value="italy"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Italy
            </option>
            <option
              value="germany"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Germany
            </option>
            <option value="uk" style={{ fontFamily: "Montserrat, sans-serif" }}>
              UK
            </option>
            <option
              value="canada"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Canada
            </option>
            {/* Add more countries as needed */}
          </TextField>

          <label htmlFor="profilePhoto">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            id="profilePhoto"
            name="profilePhoto"
            onChange={(event) => {
              formik.setFieldValue(
                "profilePhoto",
                event.currentTarget.files[0]
              );
            }}
          />

          {/* Accept Terms and Conditions Checkbox */}
          <label>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
            />
            Accept Terms and Conditions
          </label>
        </div>
        <Button
          type="submit"
          variant="contained"
          style={{ backgroundColor: "orange" }}
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        <div>
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default SignUpForm;
