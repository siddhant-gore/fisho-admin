import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { clearAuth, selectAuth } from "../redux/slices/authSlice";

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp < Date.now() / 1000;

        if (isTokenExpired) {
          dispatch(clearAuth());
          navigate("/");
        }
      } catch (error) {
        console.log(error)
        dispatch(clearAuth());
        navigate("/");
      }
    };

    checkToken();
  }, [token, navigate, dispatch]);

  return <Outlet/>;
}
