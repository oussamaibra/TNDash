/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-computed-key */
/* eslint-disable no-useless-concat */
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Upload,
  Image,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import {
  MinusCircleOutlined,
  PlusOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { isNil, isEmpty, uniq } from "lodash";
import TextArea from "antd/lib/input/TextArea";

const AccessoryModalAddEdit = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [images, setimages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const serverURL = "https://www.tnprime.shop:6443";

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        name: props?.record.name,
        stock: props?.record.stock,
        discount: props?.record.discount,
        details: props?.record.details,
        createdAt: props?.record.createdAt,
        updatedAt: props?.record.updatedAt,
        varient: props?.record.varient?.map((el) => ({
          ...el,
          images: el?.images?.split(",") || [],
          price: el?.price,
          name: el?.name,
        })),
      });

      let list = [];
      props?.record.varient?.forEach((el) => {
        list = [
          ...list,
          isEmpty(el?.images?.split(",")) ? [] : el?.images?.split(","),
        ];
      });

      console.log("list", list);
      setimages(list);
    } else {
      form.setFieldsValue({});
      form.resetFields();
      setimages([]);
    }
  }, [form, props.record, props.visible]);

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async (info, key) => {
    const oldimges = [...images];

    setLoading(true);
    try {
      const listOfPromise = [];
      info?.fileList?.forEach((el) => {
        if (!isNil(el?.originFileObj?.name)) {
          var bodyFormData = new FormData();

          bodyFormData.append("images", el?.originFileObj);

          if (!oldimges[key]) {
            oldimges[key] = [];
          }

          const Listimages = oldimges[key];

          Listimages.push(
            "https://www.tnprime.shop:6443" + "/images/" + el?.name
          );
          setimages(oldimges);

          listOfPromise.push(
            axios({
              method: "post",
              url: "https://www.tnprime.shop:6443/api/upload",
              data: bodyFormData,
              headers: { "Content-Type": "multipart/form-data" },
            })
          );
        }
      });
      await Promise.all(listOfPromise);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleonfinish = async (val) => {
    const config = {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    };
    let user = JSON.parse(localStorage.getItem("user"));
    const values = {
      ...val,
      id: props.record?.id,
    };

    // Map varient array according to schema
    const varient = values?.varient?.map((el, key) => ({
      ...el,
      images: images[key]?.join(",") || "",
      price: Number(el.price),
      name: el.name,
    }));

    const payload = {
      name: values.name,
      stock: values.stock,
      discount: values.discount,
      details: values.details,
      varient: varient,
    };

    if (props.type === "EDIT") {
      await axios
        .put("https://www.tnprime.shop:6443/api/v1/accessories/" + props?.record?._id, payload, config)
        .then((response) => {
          notification.success({ message: "Accessory Updated Successfully!" });
          props.refetch();
          onCancel();
        })
        .catch(function (err) {
          notification.error({ message: "Update Failed!" });
          props.refetch();
          onCancel();
        });
    } else {
      await axios
        .post("https://www.tnprime.shop:6443/api/v1/accessories", payload, config)
        .then((response) => {
          notification.success({ message: "Accessory Created Successfully!" });
          props.refetch();
          onCancel();
        })
        .catch(function (err) {
          notification.error({ message: "Creation Failed!" });
          props.refetch();
          onCancel();
        });
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleonfinish}
      preserve={props.type === "EDIT" ? true : false}
    >
      <div className="site-card-border-less-wrapper">
        <Modal
          title={props.type === "EDIT" ? "UPDATE ACCESSORY" : "CREATE ACCESSORY"}
          visible={visible}
          destroyOnClose
          onOk={() => {
            form.submit();
          }}
          width={1000}
          onCancel={onCancel}
        >
          <Card
            centered
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Row justify="space-between" gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input accessory name!",
                    },
                  ]}
                >
                  <Input placeholder="Accessory Name" type="text" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="stock"
                  rules={[
                    {
                      required: true,
                      message: "Please input stock quantity!",
                    },
                  ]}
                >
                  <Input placeholder="Stock Quantity" type="text" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="discount"
                  rules={[
                    {
                      required: true,
                      message: "Please input discount!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Discount Status"
                    options={[
                      {
                        value: "0",
                        label: "No Discount",
                      },
                      {
                        value: "1",
                        label: "Out of Stock",
                      },
                      {
                        value: "2",
                        label: "Best Seller",
                      },
                      {
                        value: "3",
                        label: "New Collection",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="details"
                  rules={[
                    {
                      required: true,
                      message: "Please input accessory details!",
                    },
                  ]}
                >
                  <TextArea 
                    placeholder="Accessory Details (features, compatibility, etc.)" 
                    rows={4}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.List name="varient">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key}>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing variant name",
                                  },
                                ]}
                              >
                                <Input placeholder="Variant Name (e.g., Color, Size)" />
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "price"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing price",
                                  },
                                ]}
                              >
                                <InputNumber 
                                  placeholder="Price" 
                                  style={{ width: '100%' }}
                                  min={0}
                                  step={0.01}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={6}>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                style={{ 
                                  marginTop: 8, 
                                  color: '#ff4d4f',
                                  fontSize: '16px'
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col span={24}>
                              <Form.Item shouldUpdate noStyle>
                                <Form.Item
                                  name={[name, "images"]}
                                  {...restField}
                                >
                                  <Upload
                                    key={key}
                                    className="avatar-uploader projects-uploader"
                                    onChange={(val) => handleChange(val, key)}
                                    onRemove={(val) => {
                                      const oldimges = [...images];

                                      if (!isEmpty(oldimges[key])) {
                                        oldimges[key] = oldimges[key].filter(
                                          (el) => el !== val.name
                                        );

                                        setimages(oldimges);
                                      }
                                    }}
                                    onDrop={(val) => handleChange(val, key)}
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    fileList={
                                      !isEmpty(images) &&
                                      !isNil(images) &&
                                      !isNil(images[key])
                                        ? images[key]?.map((el, i) => ({
                                            uid: -i,
                                            name: el,
                                            status: "done",
                                            url: el,
                                          }))
                                        : []
                                    }
                                    multiple={true}
                                  >
                                    <Button
                                      icon={
                                        <VerticalAlignTopOutlined
                                          style={{
                                            width: 20,
                                            color: "#000",
                                          }}
                                        />
                                      }
                                    >
                                      Upload Variant Images
                                    </Button>
                                  </Upload>
                                  {previewImage && (
                                    <Image
                                      wrapperStyle={{
                                        display: "none",
                                      }}
                                      preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) =>
                                          setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                          !visible && setPreviewImage(""),
                                      }}
                                      src={previewImage}
                                    />
                                  )}
                                </Form.Item>
                              </Form.Item>
                            </Col>
                          </Row>

                          <hr style={{ margin: '20px 0', borderColor: '#f0f0f0' }} />
                        </div>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Accessory Variant
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AccessoryModalAddEdit;