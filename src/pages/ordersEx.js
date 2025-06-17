/* eslint-disable react-hooks/rules-of-hooks */
/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Modal,
  Form,
  Input,
  notification,
  Carousel,
  Image,
  Badge,
  Select,
} from "antd";
import datetime from "moment";
import {
  DeleteTwoTone,
  EditTwoTone,
  InfoCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
  CloseCircleTwoTone,
  PlusCircleTwoTone,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { Component, useEffect, useRef, useState } from "react";
import axios from "axios";
// Images
import ava1 from "../assets/images/logo-shopify.svg";
import ava2 from "../assets/images/logo-atlassian.svg";
import ava3 from "../assets/images/logo-slack.svg";
import ava5 from "../assets/images/logo-jira.svg";
import ava6 from "../assets/images/logo-invision.svg";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import pencil from "../assets/images/pencil.svg";
import CategorieModalAddEdit from "./Modals/CategorieModalAddEdit.js";
import { CirclePicker } from "react-color";
import _, { sumBy } from "lodash";
import moment from "moment";

const { Title } = Typography;
const { confirm } = Modal;

// table code start
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// project table start

const ordersEx = () => {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [show1, setshow1] = useState(false);
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const [search, setSearch] = useState("");
  const [month, setmonth] = useState("");
  const [searchAny, setsearchAny] = useState("");
  const [description, setdescription] = useState("");
  const [ThumbnailImage, setThumbnailImage] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [refetech, setrefetech] = useState(false);
  const [isload, setisload] = useState(true);
  const [createdAt, setcreatedAt] = useState("");
  const [updatedAt, setupdatedAt] = useState("");
  const [isModalCat, setIsModalCat] = useState(false);

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setrecord] = useState({});

  const [form] = Form.useForm();
  const handrefetech = () => {
    setrefetech(!refetech);
  };
  const showDetail = (values) => {
    console.log("get by id ", values);
  };
  const show = (dar) => {
    console.log("ihekkkkk", dar);
  };

  const abilities = JSON.parse(localStorage.getItem("user"))?.abilities?.find(
    (el) => el.page === "ordersEx"
  )?.can;

  const showPromiseConfirm = (alldata) => {
    console.log("dddddddddddddd", alldata);
    confirm({
      title: "Vous voulez supprimer " + alldata._id + "?",
      icon: <ExclamationCircleOutlined />,
      content:
        "lorsque vous appuillez sur ok la Commandes N° : " +
        alldata.orderNumber +
        " " +
        " sera supprimer !",

      async onOk() {
        setisload(true);
        await axios
          .delete(`https://www.tnprime.shop:6443/api/v1/orders/${alldata._id}`)
          .then(function (response) {
            handrefetech();
            setisload(false);
          })
          .catch(function (err) {
            console.log(err);
            setisload(false);
          });
        message.success("Commande Supprimer Avec Succee !");
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "Nom du Client",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => <p>{record?.customerName}</p>,
    },
    {
      title: "Telephone du Client",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => <p>{record?.customerPhone}</p>,
    },

    {
      title: "Status",
      render: (text) => (
        <strong style={{ color: text.status === "valide" ? "green" : "red" }}>
          {" "}
          {text.status}
        </strong>
      ),
    },

    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text, record) => <p>{record?.totalPrice} TND </p>,
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },

    {
      title: "Order Date Time",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Product (if one only)",
      key: "orderDate",
      dataIndex: "orderDate",
      render: (text, record) =>
        record?.orderDetail.length === 1 ? (
          <Image
            src={record?.orderDetail[0]?.image?.split(",")[0]}
            height={100}
            width={100}
          />
        ) : (
          <> NA </>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <div className="action-buttons">
          <Row>
            {abilities.includes("read") && (
              <Col span={8} className="ms-2">
                {" "}
                <Button
                  onClick={() => {
                    setshow1(true);
                    console.log("category record detail", record);
                    setrecord(record);

                    // setrecordOption(record?.option);
                    // setoptionColor(record?.option[0].color);
                  }}
                >
                  <InfoCircleOutlined />
                </Button>
              </Col>
            )}

            {abilities.includes("delete") && (
              <Col span={8} className="ms-2">
                {" "}
                <Button
                  type="primary "
                  danger
                  onClick={() => showPromiseConfirm(record)}
                >
                  <DeleteTwoTone twoToneColor="#FFFFFF" />
                </Button>
              </Col>
            )}
          </Row>
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Product Image",
      dataIndex: "prooptions",
      key: "prooptions",
      render: (text, record) => (
        <img src={record?.image?.split(",")[0]} height={100} width={100} />
      ),
    },

    {
      title: "quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => <p>{record?.quantity}</p>,
    },

    {
      title: "Product size",
      dataIndex: "prooptions",
      key: "prooptions",
      render: (text, record) => <p>{record?.size}</p>,
    },
  ];

  useEffect(() => {
    axios
      .get("https://www.tnprime.shop:6443/api/v1/orders")
      .then((response) => {
        console.log("response", response);
        if (response.data.data) {
          const sortedArray = _.sortBy(response?.data?.data, function (o) {
            return new moment(o?.city);
          }).reverse();

          setData(sortedArray.filter((el) => el.city === "Extern"));
          setisload(false);
        } else {
          notification.error({ message: "No Data Found" });
          setisload(false);
        }
      });
  }, [refetech]);

  const handelUpdate = async (status) => {
    await axios
      .put(`https://www.tnprime.shop:6443/api/v1/orders/${record?._id}`, {
        status: status,
      })
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        console.log(err);
        setisload(false);
      });
    message.success("Commande Supprimer Avec Succee !");
  };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              loading={isload}
              className="criclebox tablespace mb-24"
              title={`Liste des Commandes (${sumBy(
                search?.length > 0 || searchAny?.length > 0 || month?.length > 0
                  ? filterData
                  : data,
                (o) => {
                  return Number(o.totalPrice);
                }
              )} TND)
              
              🚩 Valide : ${
                search?.length > 0 || searchAny?.length > 0 || month?.length > 0
                  ? filterData.filter((el) => el.status === "valide").length
                  : data.filter((el) => el.status === "valide").length
              } 
              
              🚩 En attente : ${
                search?.length > 0 || searchAny?.length > 0 || month?.length > 0
                  ? filterData.filter((el) => el.status === "en attente").length
                  : data.filter((el) => el.status === "en attente").length
              }
              
            🚩 Annuler : ${
              search?.length > 0 || searchAny?.length > 0 || month?.length > 0
                ? filterData.filter((el) => el.status === "annuler").length
                : data.filter((el) => el.status === "annuler").length
            } Commandes`}
              extra={
                <div className="d-flex">
                  <Input
                    style={{
                      marginRight: "20px",
                    }}
                    placeholder="Search by Any keyworld"
                    onChange={(e) => {
                      setsearchAny(e.target.value);
                      setfilterData(
                        data.filter(
                          (el) =>
                            (el.customerName
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase()) ||
                              el.customerPhone
                                .toLowerCase()
                                .includes(e.target.value.toLowerCase()) ||
                              el.shippingAddress
                                .toLowerCase()
                                .includes(e.target.value.toLowerCase())) &&
                            el.status
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        )
                      );
                    }}
                    value={searchAny}
                  />

                  <Select
                    style={{
                      marginRight: "20px",
                    }}
                    onChange={(value) => {
                      setSearch(value);
                      setfilterData(
                        data.filter((el) =>
                          el.status.toLowerCase().includes(value.toLowerCase())
                        )
                      );
                    }}
                    value={search}
                  >
                    <Select.Option value="en attente">En attente</Select.Option>
                    <Select.Option value="valide"> valide</Select.Option>
                    <Select.Option value="annuler">Annuler</Select.Option>
                    <Select.Option value="">All</Select.Option>
                  </Select>

                  <Select
                    onChange={(value) => {
                      setmonth(value);
                      setfilterData(
                        data.filter((el) =>
                          el.city.toLowerCase().includes(value.toLowerCase())
                        )
                      );
                    }}
                    value={month}
                  >
                    {_.times(31, (n) => {
                      return (
                        <Select.Option
                          value={moment().day(n).format("YYYY-MM-DD")}
                        >
                          {moment().day(n).format("YYYY-MM-DD")}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={
                    search?.length > 0 ||
                    searchAny?.length > 0 ||
                    month?.length > 0
                      ? filterData
                      : data
                  }
                  pagination={true}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
        <CategorieModalAddEdit
          visible={visible}
          record={action === "EDIT" ? record : {}}
          refetech={handrefetech}
          type={action}
          abilities={abilities}
          onCancel={() => setVisible(false)}
        />
      </div>

      <Modal
        visible={show1}
        destroyOnClose
        width={1000}
        footer={false}
        onCancel={() => setshow1(false)}
      >
        {record && (
          <Card>
            {record && (
              <div className="table-responsive">
                <Table
                  columns={columns2}
                  dataSource={record?.orderDetail}
                  pagination={true}
                  className="ant-border-space"
                />
              </div>
            )}

            <h3> Nom du Client: {record && record?.customerName} </h3>
            <h3> Telephone: {record && record?.customerPhone} </h3>
            <h3> shipping Address: {record && record?.shippingAddress} </h3>
            <h3>
              {" "}
              Commande: {record && record?.orderDetail?.length} article(s){" "}
            </h3>
            <h2>
              <strong>
                {" "}
                Total : {record && record?.totalPrice} TND (+ 8TND)
              </strong>{" "}
            </h2>

            {abilities.includes("edit") && (
              <>
                <Button
                  onClick={() => {
                    handelUpdate("valide");
                  }}
                  type="primary"
                  style={{ marginRight: 15, marginTop: 15 }}
                >
                  Valider la Commande{" "}
                </Button>
                <Button
                  onClick={() => {
                    handelUpdate("annuler");
                  }}
                  danger
                  style={{ marginTop: 15 }}
                >
                  Annuler la Commande{" "}
                </Button>
              </>
            )}
          </Card>
        )}
      </Modal>
    </>
  );
};

export default ordersEx;
