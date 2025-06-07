import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Typography,
  Modal,
  Input,
  notification,
  Image,
  Space,
  Tag,
  Carousel,
  Badge,
  Select,
  message,
} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  InfoCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import AccessoryModalAddEdit from "./Modals/AccessoryModalAddEdit";

const { Title } = Typography;
const { confirm } = Modal;

const Accessories = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);

  const abilities =
    JSON.parse(localStorage.getItem("user") || "{}")?.abilities?.find(
      (el) => el.page === "accessories"
    )?.can || [];

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://www.tnprime.shop:6443/api/v1/accessories"
      );
      const sortedData = _.sortBy(
        response.data.data || response.data,
        (item) => item.name
      );
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      notification.error({ message: "Failed to fetch accessories" });
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handrefetech = () => {
    fetchAccessories();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.details?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this accessory?",
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        try {
          await axios.delete(`https://www.tnprime.shop:6443/api/v1/accessories/${id}`);
          message.success("Accessory deleted successfully");
          fetchAccessories();
        } catch (error) {
          notification.error({ message: "Failed to delete accessory" });
        }
      },
    });
  };

  const getDiscountLabel = (discount) => {
    const discountMap = {
      0: "No Discount",
      1: "Out of Stock",
      2: "Best Seller",
      3: "New Collection",
    };
    return discountMap[discount] || discount;
  };

  const getDiscountColor = (discount) => {
    const colorMap = {
      0: "default",
      1: "red",
      2: "gold",
      3: "green",
    };
    return colorMap[discount] || "default";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        const isInStock =
          stock && stock !== "0" && stock.toLowerCase() !== "out of stock";
        return (
          <Tag color={isInStock ? "green" : "red"}>
            {isInStock ? `${stock} Available` : "Out of Stock"}
          </Tag>
        );
      },
    },
    {
      title: "Discount Status",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (
        <Tag color={getDiscountColor(discount)}>
          {getDiscountLabel(discount)}
        </Tag>
      ),
    },
    {
      title: "Variants",
      key: "varient",
      render: (record) => (
        <div>
          {record.varient?.map((v, index) => (
            <Tag key={index} color="blue">
              {v.name} - €{v.price}
            </Tag>
          ))}
          {(!record.varient || record.varient.length === 0) && (
            <Tag color="default">No variants</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (accessoryRecord) => (
        <Space size="middle">
          {abilities.includes("edit") && (
            <Button
              icon={<EditTwoTone />}
              onClick={() => {
                setRecord(accessoryRecord);
                setAction("EDIT");
                setVisible(true);
              }}
            />
          )}

          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedAccessory(accessoryRecord);
              setSelectedVariant(accessoryRecord.varient?.[0]?.name || "");
              setIsDetailModalVisible(true);
            }}
          />

          <Button
            danger
            icon={<DeleteTwoTone twoToneColor="#FFFFFF" />}
            onClick={() =>
              handleDelete(accessoryRecord._id || accessoryRecord.id)
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>iPhone Accessories</Title>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Accessories List"
              extra={
                <Space>
                  <Input
                    placeholder="Search accessories"
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setRecord({});
                      setAction("ADD");
                      setVisible(true);
                    }}
                  >
                    Add Accessory
                  </Button>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey={(record) => record._id || record.id}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} accessories`,
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Modal */}
        <AccessoryModalAddEdit
          visible={visible}
          record={action === "EDIT" ? record : {}}
          refetch={handrefetech}
          type={action}
          onCancel={() => setVisible(false)}
        />

        {/* Detail Modal */}
        <Modal
          title={selectedAccessory?.name}
          visible={isDetailModalVisible}
          width={800}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          {selectedAccessory && (
            <Badge.Ribbon
              color={getDiscountColor(selectedAccessory.discount)}
              text={getDiscountLabel(selectedAccessory.discount)}
            >
              <Card>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    {selectedAccessory.varient?.find(
                      (v) => v.name === selectedVariant
                    )?.images ? (
                      <Carousel autoplay>
                        {selectedAccessory.varient
                          .find((v) => v.name === selectedVariant)
                          ?.images.split(",")
                          .filter((img) => img.trim())
                          .map((img, index) => (
                            <div key={index}>
                              <Image
                                src={img.trim()}
                                alt={`${selectedAccessory.name} - ${selectedVariant}`}
                                style={{
                                  width: "100%",
                                  height: "300px",
                                  objectFit: "cover",
                                }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                              />
                            </div>
                          ))}
                      </Carousel>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f5f5f5",
                          border: "1px dashed #d9d9d9",
                        }}
                      >
                        <span style={{ color: "#999" }}>
                          No images available
                        </span>
                      </div>
                    )}
                  </Col>
                  <Col span={12}>
                    <Title level={4}>{selectedAccessory.name}</Title>
                    <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                      {selectedAccessory.details || "No details available"}
                    </p>

                    <div style={{ margin: "20px 0" }}>
                      <Title level={5}>Variants:</Title>
                      <Space wrap>
                        {selectedAccessory.varient?.map((v, index) => (
                          <Button
                            key={index}
                            type={
                              selectedVariant === v.name ? "primary" : "default"
                            }
                            onClick={() => setSelectedVariant(v.name)}
                            style={{ marginBottom: "8px" }}
                          >
                            {v.name}
                          </Button>
                        ))}
                      </Space>
                    </div>

                    <div style={{ margin: "20px 0" }}>
                      <Title level={5}>Price:</Title>
                      <Tag
                        color="green"
                        style={{ fontSize: 18, padding: "8px 12px" }}
                      >
                        €
                        {selectedAccessory.varient?.find(
                          (v) => v.name === selectedVariant
                        )?.price || "N/A"}
                      </Tag>
                    </div>

                    <div style={{ margin: "20px 0" }}>
                      <Title level={5}>Stock:</Title>
                      <Tag
                        color={
                          selectedAccessory.stock &&
                          selectedAccessory.stock !== "0" &&
                          selectedAccessory.stock.toLowerCase() !==
                            "out of stock"
                            ? "green"
                            : "red"
                        }
                        style={{ fontSize: 16, padding: "6px 10px" }}
                      >
                        {selectedAccessory.stock &&
                        selectedAccessory.stock !== "0" &&
                        selectedAccessory.stock.toLowerCase() !== "out of stock"
                          ? `${selectedAccessory.stock} Available`
                          : "Out of Stock"}
                      </Tag>
                    </div>

                    <div style={{ margin: "20px 0" }}>
                      <Title level={5}>Status:</Title>
                      <Tag
                        color={getDiscountColor(selectedAccessory.discount)}
                        style={{ fontSize: 16, padding: "6px 10px" }}
                      >
                        {getDiscountLabel(selectedAccessory.discount)}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Badge.Ribbon>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Accessories;
