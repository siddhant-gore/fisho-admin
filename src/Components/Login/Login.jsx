import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./login.module.css";
import SlickSlider from "./SlickSlider";
import { useAxiosInstance } from "../../AxiosInstance";
import { useLoginUserMutation } from "../../redux/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setToken, setUser } from "../../redux/slices/authSlice";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import { Spin } from "antd";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false); 
  const {token} = useSelector(selectAuth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInstance();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");


  const [loginUser,{isLoading}] = useLoginUserMutation();

  // State to hold form values
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
    addresses: "", // Added address field
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission

  const handleSubmit =async (e)=>{
    e.preventDefault();
    try {
          const data = await loginUser(formValues).unwrap();
          console.log(data)
        dispatch(setToken(data?.data?.accessToken));
        dispatch(setUser(data?.data?.userData));
        toast.success(data?.data?.message);
        // navigate('/dash/home')
        navigate("/dashboard");
        
    } catch (error) {
        getError(error);
    }
}


useEffect(()=>{
   if(token){
    navigate('/dashboard')
   }
},[token])

  const handleSubmitOld = async (e) => {
    e.preventDefault();

    // Convert phone_no to a number
    const phoneNo = parseInt(formValues.phone_no.trim(), 10);

    if (!/^\d{10}$/.test(phoneNo)) {
      alert("Invalid phone number format. It should be 10 digits.");
      return;
    }

    try {
      if (isRegister && !isOtpSent) {
        // Step 1: Send OTP for registration
        const response = await axiosInstance.post(
          "/delivery-partner/send-otp-register", // Updated endpoint
          { phone_no: phoneNo }
        );

        if (response.data.data?.otpSent) {
          setIsOtpSent(true);
          alert("OTP sent to your phone!");
        }
      } else if (isRegister && isOtpSent) {
        // Step 2: Verify OTP before registration
        const verifyResponse = await axiosInstance.post(
          "/delivery-partner/verify-otp-register", // Updated endpoint
          { phone_no: phoneNo, otp }
        );

        if (verifyResponse.data.data?.otpVerified) {
          // Step 3: Register user after OTP verification
          await axiosInstance.post("/delivery-partner/register", {
            firstname: formValues.firstname.trim(),
            lastname: formValues.lastname.trim(),
            phone_no: phoneNo,
            agreedToTos: true,
          });

          alert("Registration successful!");
          setIsRegister(false);
          setIsOtpSent(false);
          setFormValues({
            firstname: "",
            lastname: "",
            email: "",
            phone_no: "",
            password: "",
            confirmPassword: "",
            addresses: "",
          });
        } else {
          alert("Invalid OTP, please try again.");
        }
      } else if (isOtpLogin && !isOtpSent) {
        // Step 1: Send OTP for login
        const response = await axiosInstance.post(
          "/delivery-partner/send-otp-signin", // Updated endpoint
          { phone_no: phoneNo }
        );

        if (response.data.data?.otpSent) {
          setIsOtpSent(true);
          alert("OTP sent to your phone!");
        }
      } else if (isOtpLogin && isOtpSent) {
        // Step 2: Verify OTP for login
        const verifyResponse = await axiosInstance.post(
          "/delivery-partner/verify-signin-otp", // Updated endpoint
          { phone_no: phoneNo, otp: parseInt(otp, 10) }
        );

        console.log(verifyResponse.data.data);

        if (verifyResponse.data.data?.verified) {
          const token = verifyResponse.data?.data?.accessToken;
          if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
          } else {
            alert("Token not received. Please try again.");
          }
        } else {
          alert("Invalid OTP, please try again.");
        }
      } else {
        // Login with password
        const response = await axiosInstance.post("/delivery-partners/signin", {
          phone_no: phoneNo,
          password: formValues.password.trim(),
        });

        const token = response.data?.data?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          alert("Token not received. Please try again.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className={styles.loginHeadContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginFormContainer}>
          <div className={styles.logo}>Fisho</div>
          <div className={styles.form}>
            <span className={styles.text}>Welcome to Fisho Admin Panel</span>
            <form onSubmit={handleSubmit}>
              {(isOtpLogin && isOtpSent) || (isRegister && isOtpSent) ? (
                <div className={styles.inputGroup}>
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="number"
                    id="otp"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  {isRegister && (
                    <>
                      <div className={styles.inputGroup}>
                        <label htmlFor="firstname">First Name</label>
                        <input
                          type="text"
                          id="firstname"
                          name="firstname"
                          placeholder="First name"
                          value={formValues.firstname}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="lastname">Last Name</label>
                        <input
                          type="text"
                          id="lastname"
                          name="lastname"
                          placeholder="Last name"
                          value={formValues.lastname}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Email"
                          value={formValues.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="address">Address</label>{" "}
                        {/* New Address Field */}
                        <input
                          type="text"
                          id="addresses"
                          name="addresses"
                          placeholder="Address"
                          value={formValues.addresses}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  <div className={styles.inputGroup}>
                    <label htmlFor="phone_no">Phone Number</label>
                    <input
                      type="number" // Changed to number
                      id="phone_no"
                      name="phone_no"
                      placeholder="Phone number"
                      value={formValues.phone_no}
                      onChange={handleChange}
                    />
                    <label htmlFor="phone_no">Password</label>
                    <input
                      type="password" // Changed to number
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formValues.password}
                      onChange={handleChange}
                    />
                  </div>

                  {/* {isOtpLogin ? null : (
                    <div className={styles.inputGroup}>
                      <label htmlFor="password">Password</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Password"
                          value={formValues.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )} */}

                  {/* {isRegister && (
                    <div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordWrapper}>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formValues.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className={styles.passwordWrapper}>
                          <input
                            type={showPasswordTwo ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )} */}


                  <button type="submit" disabled={isLoading} className={styles.submitButton}>
                    {isLoading ? 
                    <Spin/>
                    :
                    isRegister
                      ? "Register"
                      : isOtpLogin
                      ? "Login with OTP"
                      : "Login"}
                  </button>
                </>
              )}
            </form>
            <div>
              {isRegister ? (
                <>
                  <span className={styles.linkText}>
                    Already have an account?
                  </span>
                  <span
                    className={styles.toggleLink}
                    
                    onClick={() => {
                      setIsRegister(false);
                      setIsOtpLogin(false); // Reset OTP login state
                      setOtp(""); // Reset OTP login state
                      setFormValues({
                        firstname: "",
                        lastname: "",
                        email: "",
                        phone_no: "",
                        password: "",
                        confirmPassword: "",
                        addresses: "", // Reset address field
                      });
                    }}
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.linkText}>
                    Don't have an account?
                  </span>
                  <span
                    className={styles.toggleLink}
                    onClick={() => {
                      setIsRegister(true);
                      setOtp("");
                      setFormValues({
                        firstname: "",
                        lastname: "",
                        email: "",
                        phone_no: "",
                        password: "",
                        confirmPassword: "",
                        addresses: "", // Reset address field
                      });
                    }}
                  >
                    Register
                  </span>
                  <span
                    className={styles.toggleLink}
                    onClick={() => {
                      setIsOtpLogin(true);
                      setOtp("");
                      setFormValues({
                        firstname: "",
                        lastname: "",
                        email: "",
                        phone_no: "",
                        password: "",
                        confirmPassword: "",
                        addresses: "", // Reset address field
                      });
                    }}
                  >
                    Login with OTP
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.crousor}>
          <SlickSlider />
        </div>
      </div>
    </div>
  );
}
