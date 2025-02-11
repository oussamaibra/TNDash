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
  Spin,
  Tag,
  Upload,
} from "antd";

import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import {
  CloudUploadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { isNil } from "lodash";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;

const AddOrUpdateAdmin = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const serverURL = "https://www.tnprime.shop:6443";

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props?.record,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        images: [],
      });
    }
  }, [form, props.record, props.visible]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = async (info, listfilesuploaded) => {
    setLoading(true);
    try {
      const listOfPromise = [];
      info?.fileList?.forEach((el) => {
        if (
          !isNil(el?.originFileObj?.name) &&
          !listfilesuploaded?.find(
            (val) =>
              val ===
              "https://www.tnprime.shop:6443" + "/images/" + el?.originFileObj?.name
          )
        ) {
          console.log("eeeeeeeeee");
          var bodyFormData = new FormData();

          bodyFormData.append("images", el.originFileObj);
          form.setFieldsValue({
            images: [
              ...form.getFieldValue("images"),
              "https://www.tnprime.shop:6443" + "/images/" + el?.originFileObj.name,
            ],
          });
          listOfPromise.push(
            axios({
              method: "post",
              url: "https://www.tnprime.shop:6443" + "/api/upload",
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
      id: props.record.id,
    };
    console.log("values", values);
    const img = form.getFieldValue("images");
    if (props.type === "EDIT") {
      console.log("edit", values);
      await axios
        .put("https://www.tnprime.shop:6443/api/v1/admins/" + values.id, {
          username: values?.username,
          password: values?.password,
          email: values?.email,
          role: "ADMIN",
          active: values?.status,
        })
        .then((response) => {
          notification.success({ message: "Update Done  " });
          props.refetech();
          onCancel();
        })
        .catch(function (err) {
          props.refetech();
          onCancel();
        });
    } else {
      console.log("from", form.getFieldValue("data"));
      await axios
        .post("https://www.tnprime.shop:6443/api/v1/admins", {
          email: values?.email,
          username: values?.username,
          password: values?.password,
          role: "ADMIN",
        })
        .then((response) => {
          console.log("response", response);
          notification.success({ message: "Admin Crée avec succée " });
          props.refetech();
          onCancel();
        })
        .catch(function (err) {
          props.refetech();
          onCancel();
        });
    }
  };
  const handlePreview = async (file) => {
    console.log("file", file);
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  return (
    <>
      <Modal
        visible={previewOpen}
        //  title={previewTitle}
        destroyOnClose
        footer={null}
        onCancel={() => setPreviewOpen(!previewOpen) && setPreviewImage("")}
      >
        <img
          alt={previewImage?.name}
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>

      <div className="site-card-border-less-wrapper">
        <Modal
          title={props.type === "EDIT" ? "Modifier" : "Ajouter"}
          visible={visible}
          destroyOnClose
          onOk={() => {
            form.submit();
          }}
          width={1000}
          onCancel={onCancel}
          className="criclebox "
        >
          <Form
            form={form}
            onFinish={handleonfinish}
            preserve={props.type === "EDIT" ? true : false}
          >
            <Card
              centered
              style={{
                width: "100%",
                height: "100%",
              }}
              hoverable
              className="criclebox "
            >
              <Row justify="space-between" gutter={16}>
                <Col span={24}>
                  {Loading ? (
                    <Row justify="center">
                      <Spin />
                    </Row>
                  ) : (
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name="username"
                          rules={[
                            {
                              required: true,
                              message: "Veuillez entrer le nom d'utilisateur!",
                            },
                          ]}
                        >
                          <Input placeholder="Nom d'utlisiateur" type="name" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              required: true,
                              message: "Merci de saisir l'Email'!",
                              type: "email",
                            },
                          ]}
                        >
                          <Input placeholder="Email" type="Email" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        {props.type === "EDIT" ? (
                          <Form.Item
                            name="status"
                            rules={[
                              {
                                required: true,
                                message: "Merci de sélectionner le statut!",
                              },
                            ]}
                          >
                            <Select placeholder="Statut">
                              <Select.Option value={true}>
                                Activer
                              </Select.Option>
                              <Select.Option value={false}>
                                Suspendre
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Merci de saisir le mot de passe'!",
                              },
                            ]}
                          >
                            <TextArea placeholder="Mot de passe" type="text" />
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default AddOrUpdateAdmin;
