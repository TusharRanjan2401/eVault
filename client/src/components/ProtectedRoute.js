import React, { useEffect, useState } from "react";
import { GetUserInfo } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import DefaultLayout from "./DefaultLayout";

const ProtectedRoute = (props) => {
  const { user,reloadUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await GetUserInfo();
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        message.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!user) {
        getData();
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (reloadUser) {
      getData();
    }
  },[])
  return (
    user && (
      <div>
              <DefaultLayout>{props.children}</DefaultLayout>
      </div>
    )
  );
};

export default ProtectedRoute;
