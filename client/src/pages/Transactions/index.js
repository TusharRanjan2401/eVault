import React, { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { message, Table } from "antd";
import TransferFundsModal from "./TransferFundsModal";
import { GetTransactionsOfUser } from "../../apicalls/transactions";
import moment from "moment";
import { useSelector } from "react-redux";
import DepositeModal from "./DepositeModal";

const Transactions = () => {
  const [showTransferFundsModal, setShowTransferFundsModal] = useState(false);
  const [data, setData] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { user } = useSelector((state) => state.users);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transaction ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        if (record.sender._id === record.receiver._id) {
          return "Deposit";
        } else if (record.sender._id === user._id) {
          return "Debit";
        } else {
          return "Credit";
        }
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const getData = async () => {
    try {
      const response = await GetTransactionsOfUser();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Transactions" />
        <div className="flex gap-1">
          <button
            className="primary-outlined-btn"
            onClick={() => setShowDepositModal(true)}
          >
            Deposit
          </button>
          <button
            className="primary-contained-btn"
            onClick={() => setShowTransferFundsModal(true)}
          >
            Transfer
          </button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} className="mt-2" />

      {showTransferFundsModal && (
        <TransferFundsModal
          showTransferFundsModal={showTransferFundsModal}
          setShowTransferFundsModal={setShowTransferFundsModal}
          reloadData={getData}
        />
      )}

      {showDepositModal && (
        <DepositeModal
          showDepositModal={showDepositModal}
          setShowDepositModal={setShowDepositModal}
          reloadData={getData}
        />
      )}
    </div>
  );
};

export default Transactions;
