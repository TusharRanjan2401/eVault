import { Form, message, Modal } from "antd";
import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { DepositFunds } from "../../apicalls/transactions";

const DepositeModal = ({
  showDepositModal,
  setShowDepositModal,
  reloadData,
}) => {
  const [form] = Form.useForm();
  const onToken = async (token) => {
    try {
      const response = await DepositFunds({
        token,
        amount: form.getFieldValue("amount"),
      });
      if (response.success) {
        reloadData();
        setShowDepositModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <Modal
      title="Deposit"
      open={showDepositModal}
      onCancel={() => setShowDepositModal(false)}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}
          >
            <input type="number" className="w-400" />
          </Form.Item>
          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn"
            onClick={() =>setShowDepositModal(false)}
            >Cancel</button>
            <StripeCheckout
              token={onToken}
              currency="USD"
              amount={form.getFieldValue("amount") * 100}
              shippingAddress
              stripeKey="pk_test_51Por0dP1SKqtbQJO1LdBuOfPaCdWopNmR2jpmM2buh8H4dZjeuqLQ3ua20bVaCOSyUH3IYwUbt4SdMmqqenBKdpH003qvAauiX"
            >
              <button className="primary-contained-btn">Depoist</button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default DepositeModal;
