import { Form, Col, Row, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className="bg-primary flex items-center justify-center h-screen">
      <div className="card w-400 p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">EVAULT - LOGIN</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Row>
            <Col span={22}>
              <Form.Item label="Email" name="email">
                <input type="text" />
              </Form.Item>
            </Col>

            <Col span={22}>
              <Form.Item label="Password" name="password">
                <input type="password" />
              </Form.Item>
            </Col>
          </Row>

          <button className="primary-contained-btn w-100" type="submit">
            Login
          </button>
          <h1
            className="text-sm underline mt-2"
            onClick={() => navigate("/register")}
          >
            Not a member, Click here to Register
          </h1>
        </Form>
      </div>
    </div>
  );
};

export default Login;
