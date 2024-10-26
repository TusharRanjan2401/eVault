import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import { GetAllUsers, UpdateUserVerifiedStatus } from "../../apicalls/users";
import PageTitle from "../../components/PageTitle";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getData = async () => {
    try {
      const response = await GetAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateStatus = async (record, isVerified) => {
    try {
      const response = await UpdateUserVerifiedStatus({
        selectedUser: record._id,
        isVerified,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (text, record) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isVerified ? (
              <button className="primary-outlined-btn"
              onClick={()=>updateStatus(record,false)}
              >Suspend</button>
            ) : (
                <button className="primary-outlined-btn"
                onClick={()=>updateStatus(record,true)}
                >Activate</button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageTitle title="users" />
      <Table dataSource={users} columns={columns} className="mt-2" />
    </div>
  );
};

export default Users;
