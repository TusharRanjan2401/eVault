import React, { useState } from "react";
import { Form, Modal, Button, message } from "antd";
import { VerifyAccount } from "../../apicalls/transactions";
import { useSelector } from "react-redux";
import { SendRequest } from "../../apicalls/requests";

const NewRequestModal = ({
  showNewRequestModal,
  setShowNewRequestModal,
  reloadData,
}) => {
  const { user } = useSelector((state) => state.users);
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();

  const verifyAccount = async () => {
    try {
      const response = await VerifyAccount({
        receiver: form.getFieldValue("receiver"),
      });

      if (response.success) {
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      setIsVerified("false");
    }
  };
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        sender: user._id,
        reference: values.receiver,
        status: "success",
      };
      const response = await SendRequest(payload);
      if (response.success) {
        reloadData();
        setShowNewRequestModal(false);
        message.success(response.message);
      } else {
        message.error(response.error);
      }
    } catch (error) {}
  };
  return (
    <Modal
      title="Transfer Funds"
      open={showNewRequestModal}
      onCancel={() => setShowNewRequestModal(false)}
      footer={null}
    >
      <hr />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Account Number" name="receiver" className="w-400">
          <input type="text" />
        </Form.Item>
        <Button
          className="primary-contained-btn mt-1"
          type="button"
          onClick={verifyAccount}
        >
          VERIFY
        </Button>
        {isVerified === "true" && (
          <div className="success-bg">Account verified successfully</div>
        )}
        {isVerified === "false" && (
          <div className="error-bg">Invalid Account</div>
        )}
        <Form.Item
          label="Amount"
          name="amount"
          className="w-400"
          rules={[
            {
              required: true,
              message: "Please input your amount!",
            },
            {
              max: user.balance,
              message: "Insufficient balance",
            },
          ]}
        >
          <input type="number" max={user.balance} />
        </Form.Item>
        <Form.Item label="Description" name="description" className="w-400">
          <textarea type="text" />
        </Form.Item>

        <div className="flex justify-end gap-1">
          <button className="primary-outlined-btn"
          onClick={() => setShowNewRequestModal(false)}
          >Cancel</button>
          {isVerified === "true" && (
            <button className="primary-contained-btn">Request</button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default NewRequestModal;
