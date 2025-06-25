import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  Image,
  Popover,
  notification,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import {
  MinusCircleOutlined,
  PlusOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { isNil, isEmpty } from "lodash";
import TextArea from "antd/lib/input/TextArea";
import { HexColorPicker } from "react-colorful";
import axios from "axios";

const CaseModalAddEdit = (props) => {
  const { visible, onCancel, type, record, refetch } = props;
  const [loading, setLoading] = useState(false);
  const [images, setimages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isIphone, setIsIphone] = useState(true);
  const [form] = useForm();

  // Color options with hex values
  const colorOptions = [
    { value: "#000000", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FF0000", label: "Red" },
    { value: "#0000FF", label: "Blue" },
    { value: "#008000", label: "Green" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#FFC0CB", label: "Pink" },
    { value: "#800080", label: "Purple" },
    { value: "#FFD700", label: "Gold" },
    { value: "#C0C0C0", label: "Silver" },
    { value: "#00FFFFFF", label: "Transparent" },
    { value: "multicolor", label: "Multicolor" },
  ];

  // iPhone and Samsung device lists (truncated for brevity)
  const listIphone = [
    { value: "iPhone 16 Pro Max", label: "iPhone 16 Pro Max" },
    { value: "iPhone 16 Pro", label: "iPhone 16 Pro" },
    { value: "iPhone 16 Plus", label: "iPhone 16 Plus" },
    { value: "iPhone 16", label: "iPhone 16" },

    { value: "iPhone 15 Pro Max", label: "iPhone 15 Pro Max" },
    { value: "iPhone 15 Pro", label: "iPhone 15 Pro" },
    { value: "iPhone 15 Plus", label: "iPhone 15 Plus" },
    { value: "iPhone 15", label: "iPhone 15" },

    { value: "iPhone 14 Pro Max", label: "iPhone 14 Pro Max" },
    { value: "iPhone 14 Pro", label: "iPhone 14 Pro" },
    { value: "iPhone 14 Plus", label: "iPhone 14 Plus" },
    { value: "iPhone 14", label: "iPhone 14" },
    { value: "iPhone 13 Pro Max", label: "iPhone 13 Pro Max" },
    { value: "iPhone 13 Pro", label: "iPhone 13 Pro" },
    { value: "iPhone 13 Mini", label: "iPhone 13 Mini" },
    { value: "iPhone 13", label: "iPhone 13" },
    { value: "iPhone 12 Pro Max", label: "iPhone 12 Pro Max" },
    { value: "iPhone 12 Pro", label: "iPhone 12 Pro" },
    { value: "iPhone 12 Mini", label: "iPhone 12 Mini" },
    { value: "iPhone 12", label: "iPhone 12" },
    { value: "iPhone 11 Pro Max", label: "iPhone 11 Pro Max" },
    { value: "iPhone 11 Pro", label: "iPhone 11 Pro" },
    { value: "iPhone 11", label: "iPhone 11" },
    {
      value: "iPhone SE (3rd generation)",
      label: "iPhone SE (3rd generation)",
    },
    {
      value: "iPhone SE (2nd generation)",
      label: "iPhone SE (2nd generation)",
    },
    { value: "iPhone XR", label: "iPhone XR" },
    { value: "iPhone XS Max", label: "iPhone XS Max" },
    { value: "iPhone XS", label: "iPhone XS" },
    { value: "iPhone X", label: "iPhone X" },
    { value: "iPhone 8 Plus", label: "iPhone 8 Plus" },
    { value: "iPhone 8", label: "iPhone 8" },
    { value: "iPhone 7 Plus", label: "iPhone 7 Plus" },
  ];
  const listSam = [
    { value: "Samsung Galaxy S6", label: "Samsung Galaxy S6" },
    { value: "Samsung Galaxy S6 Edge", label: "Samsung Galaxy S6 Edge" },
    { value: "Samsung Galaxy Note 5", label: "Samsung Galaxy Note 5" },
    { value: "Samsung Galaxy A3 (2015)", label: "Samsung Galaxy A3 (2015)" },
    { value: "Samsung Galaxy A5 (2015)", label: "Samsung Galaxy A5 (2015)" },
    { value: "Samsung Galaxy A7 (2015)", label: "Samsung Galaxy A7 (2015)" },
    { value: "Samsung Galaxy J1", label: "Samsung Galaxy J1" },
    { value: "Samsung Galaxy J5", label: "Samsung Galaxy J5" },
    { value: "Samsung Galaxy J7", label: "Samsung Galaxy J7" },
    { value: "Samsung Galaxy S7", label: "Samsung Galaxy S7" },
    { value: "Samsung Galaxy S7 Edge", label: "Samsung Galaxy S7 Edge" },
    { value: "Samsung Galaxy Note 7", label: "Samsung Galaxy Note 7" },
    { value: "Samsung Galaxy A3 (2016)", label: "Samsung Galaxy A3 (2016)" },
    { value: "Samsung Galaxy A5 (2016)", label: "Samsung Galaxy A5 (2016)" },
    { value: "Samsung Galaxy A7 (2016)", label: "Samsung Galaxy A7 (2016)" },
    { value: "Samsung Galaxy A8 (2016)", label: "Samsung Galaxy A8 (2016)" },
    { value: "Samsung Galaxy J2", label: "Samsung Galaxy J2" },
    { value: "Samsung Galaxy J3", label: "Samsung Galaxy J3" },
    { value: "Samsung Galaxy J5 (2016)", label: "Samsung Galaxy J5 (2016)" },
    { value: "Samsung Galaxy J7 (2016)", label: "Samsung Galaxy J7 (2016)" },
    { value: "Samsung Galaxy S8", label: "Samsung Galaxy S8" },
    { value: "Samsung Galaxy S8+", label: "Samsung Galaxy S8+" },
    { value: "Samsung Galaxy Note 8", label: "Samsung Galaxy Note 8" },
    { value: "Samsung Galaxy A3 (2017)", label: "Samsung Galaxy A3 (2017)" },
    { value: "Samsung Galaxy A5 (2017)", label: "Samsung Galaxy A5 (2017)" },
    { value: "Samsung Galaxy A7 (2017)", label: "Samsung Galaxy A7 (2017)" },
    { value: "Samsung Galaxy A8 (2018)", label: "Samsung Galaxy A8 (2018)" },
    { value: "Samsung Galaxy J3 (2017)", label: "Samsung Galaxy J3 (2017)" },
    { value: "Samsung Galaxy J5 (2017)", label: "Samsung Galaxy J5 (2017)" },
    { value: "Samsung Galaxy J7 (2017)", label: "Samsung Galaxy J7 (2017)" },
    { value: "Samsung Galaxy S9", label: "Samsung Galaxy S9" },
    { value: "Samsung Galaxy S9+", label: "Samsung Galaxy S9+" },
    { value: "Samsung Galaxy Note 9", label: "Samsung Galaxy Note 9" },
    { value: "Samsung Galaxy A6", label: "Samsung Galaxy A6" },
    { value: "Samsung Galaxy A6+", label: "Samsung Galaxy A6+" },
    { value: "Samsung Galaxy A7 (2018)", label: "Samsung Galaxy A7 (2018)" },
    { value: "Samsung Galaxy A8 (2018)", label: "Samsung Galaxy A8 (2018)" },
    { value: "Samsung Galaxy A8+ (2018)", label: "Samsung Galaxy A8+ (2018)" },
    { value: "Samsung Galaxy A9 (2018)", label: "Samsung Galaxy A9 (2018)" },
    { value: "Samsung Galaxy J4", label: "Samsung Galaxy J4" },
    { value: "Samsung Galaxy J6", label: "Samsung Galaxy J6" },
    { value: "Samsung Galaxy J8", label: "Samsung Galaxy J8" },
    { value: "Samsung Galaxy S10e", label: "Samsung Galaxy S10e" },
    { value: "Samsung Galaxy S10", label: "Samsung Galaxy S10" },
    { value: "Samsung Galaxy S10+", label: "Samsung Galaxy S10+" },
    { value: "Samsung Galaxy S10 5G", label: "Samsung Galaxy S10 5G" },
    { value: "Samsung Galaxy Note 10", label: "Samsung Galaxy Note 10" },
    { value: "Samsung Galaxy Note 10+", label: "Samsung Galaxy Note 10+" },
    { value: "Samsung Galaxy A10", label: "Samsung Galaxy A10" },
    { value: "Samsung Galaxy A20", label: "Samsung Galaxy A20" },
    { value: "Samsung Galaxy A30", label: "Samsung Galaxy A30" },
    { value: "Samsung Galaxy A40", label: "Samsung Galaxy A40" },
    { value: "Samsung Galaxy A50", label: "Samsung Galaxy A50" },
    { value: "Samsung Galaxy A60", label: "Samsung Galaxy A60" },
    { value: "Samsung Galaxy A70", label: "Samsung Galaxy A70" },
    { value: "Samsung Galaxy A80", label: "Samsung Galaxy A80" },
    { value: "Samsung Galaxy A90 5G", label: "Samsung Galaxy A90 5G" },
    { value: "Samsung Galaxy M10", label: "Samsung Galaxy M10" },
    { value: "Samsung Galaxy M20", label: "Samsung Galaxy M20" },
    { value: "Samsung Galaxy M30", label: "Samsung Galaxy M30" },
    { value: "Samsung Galaxy S20", label: "Samsung Galaxy S20" },
    { value: "Samsung Galaxy S20+", label: "Samsung Galaxy S20+" },
    { value: "Samsung Galaxy S20 Ultra", label: "Samsung Galaxy S20 Ultra" },
    { value: "Samsung Galaxy Note 20", label: "Samsung Galaxy Note 20" },
    {
      value: "Samsung Galaxy Note 20 Ultra",
      label: "Samsung Galaxy Note 20 Ultra",
    },
    { value: "Samsung Galaxy A01", label: "Samsung Galaxy A01" },
    { value: "Samsung Galaxy A11", label: "Samsung Galaxy A11" },
    { value: "Samsung Galaxy A21", label: "Samsung Galaxy A21" },
    { value: "Samsung Galaxy A31", label: "Samsung Galaxy A31" },
    { value: "Samsung Galaxy A41", label: "Samsung Galaxy A41" },
    { value: "Samsung Galaxy A51", label: "Samsung Galaxy A51" },
    { value: "Samsung Galaxy A71", label: "Samsung Galaxy A71" },
    { value: "Samsung Galaxy A81", label: "Samsung Galaxy A81" },
    { value: "Samsung Galaxy A91", label: "Samsung Galaxy A91" },
    { value: "Samsung Galaxy M21", label: "Samsung Galaxy M21" },
    { value: "Samsung Galaxy M31", label: "Samsung Galaxy M31" },
    { value: "Samsung Galaxy M51", label: "Samsung Galaxy M51" },
    { value: "Samsung Galaxy Z Flip", label: "Samsung Galaxy Z Flip" },
    { value: "Samsung Galaxy Z Fold 2", label: "Samsung Galaxy Z Fold 2" },
    { value: "Samsung Galaxy S21", label: "Samsung Galaxy S21" },
    { value: "Samsung Galaxy S21+", label: "Samsung Galaxy S21+" },
    { value: "Samsung Galaxy S21 Ultra", label: "Samsung Galaxy S21 Ultra" },
    { value: "Samsung Galaxy A02", label: "Samsung Galaxy A02" },
    { value: "Samsung Galaxy A12", label: "Samsung Galaxy A12" },
    { value: "Samsung Galaxy A22", label: "Samsung Galaxy A22" },
    { value: "Samsung Galaxy A32", label: "Samsung Galaxy A32" },
    { value: "Samsung Galaxy A42", label: "Samsung Galaxy A42" },
    { value: "Samsung Galaxy A52", label: "Samsung Galaxy A52" },
    { value: "Samsung Galaxy A72", label: "Samsung Galaxy A72" },
    { value: "Samsung Galaxy M12", label: "Samsung Galaxy M12" },
    { value: "Samsung Galaxy M22", label: "Samsung Galaxy M22" },
    { value: "Samsung Galaxy M32", label: "Samsung Galaxy M32" },
    { value: "Samsung Galaxy M52", label: "Samsung Galaxy M52" },
    { value: "Samsung Galaxy Z Flip 3", label: "Samsung Galaxy Z Flip 3" },
    { value: "Samsung Galaxy Z Fold 3", label: "Samsung Galaxy Z Fold 3" },
    { value: "Samsung Galaxy S22", label: "Samsung Galaxy S22" },
    { value: "Samsung Galaxy S22+", label: "Samsung Galaxy S22+" },
    { value: "Samsung Galaxy S22 Ultra", label: "Samsung Galaxy S22 Ultra" },
    { value: "Samsung Galaxy A13", label: "Samsung Galaxy A13" },
    { value: "Samsung Galaxy A23", label: "Samsung Galaxy A23" },
    { value: "Samsung Galaxy A33", label: "Samsung Galaxy A33" },
    { value: "Samsung Galaxy A53", label: "Samsung Galaxy A53" },
    { value: "Samsung Galaxy A73", label: "Samsung Galaxy A73" },
    { value: "Samsung Galaxy M13", label: "Samsung Galaxy M13" },
    { value: "Samsung Galaxy M23", label: "Samsung Galaxy M23" },
    { value: "Samsung Galaxy M33", label: "Samsung Galaxy M33" },
    { value: "Samsung Galaxy M53", label: "Samsung Galaxy M53" },
    { value: "Samsung Galaxy Z Flip 4", label: "Samsung Galaxy Z Flip 4" },
    { value: "Samsung Galaxy Z Fold 4", label: "Samsung Galaxy Z Fold 4" },
    { value: "Samsung Galaxy S23", label: "Samsung Galaxy S23" },
    { value: "Samsung Galaxy S23+", label: "Samsung Galaxy S23+" },
    { value: "Samsung Galaxy S23 Ultra", label: "Samsung Galaxy S23 Ultra" },
    { value: "Samsung Galaxy A14", label: "Samsung Galaxy A14" },
    { value: "Samsung Galaxy A24", label: "Samsung Galaxy A24" },
    { value: "Samsung Galaxy A34", label: "Samsung Galaxy A34" },
    { value: "Samsung Galaxy A54", label: "Samsung Galaxy A54" },
    { value: "Samsung Galaxy A74", label: "Samsung Galaxy A74" },
    { value: "Samsung Galaxy M14", label: "Samsung Galaxy M14" },
    { value: "Samsung Galaxy M24", label: "Samsung Galaxy M24" },
    { value: "Samsung Galaxy M34", label: "Samsung Galaxy M34" },
    { value: "Samsung Galaxy M54", label: "Samsung Galaxy M54" },
    { value: "Samsung Galaxy Z Flip 5", label: "Samsung Galaxy Z Flip 5" },
    { value: "Samsung Galaxy Z Fold 5", label: "Samsung Galaxy Z Fold 5" },
    { value: "Samsung Galaxy S24", label: "Samsung Galaxy S24" },
    { value: "Samsung Galaxy S24+", label: "Samsung Galaxy S24+" },
    { value: "Samsung Galaxy S24 Ultra", label: "Samsung Galaxy S24 Ultra" },
    { value: "Samsung Galaxy A15", label: "Samsung Galaxy A15" },
    { value: "Samsung Galaxy A25", label: "Samsung Galaxy A25" },
    { value: "Samsung Galaxy A35", label: "Samsung Galaxy A35" },
    { value: "Samsung Galaxy A55", label: "Samsung Galaxy A55" },
    { value: "Samsung Galaxy M15", label: "Samsung Galaxy M15" },
    { value: "Samsung Galaxy M25", label: "Samsung Galaxy M25" },
    { value: "Samsung Galaxy M35", label: "Samsung Galaxy M35" },
    { value: "Samsung Galaxy M55", label: "Samsung Galaxy M55" },
    { value: "Samsung Galaxy Z Flip 6", label: "Samsung Galaxy Z Flip 6" },
    { value: "Samsung Galaxy Z Fold 6", label: "Samsung Galaxy Z Fold 6" },
    { value: "Samsung Galaxy S25", label: "Samsung Galaxy S25" },
    { value: "Samsung Galaxy S25+", label: "Samsung Galaxy S25+" },
    { value: "Samsung Galaxy S25 Ultra", label: "Samsung Galaxy S25 Ultra" },
  ];

  const serverURL = "https://www.tnprime.shop:6443";

  useEffect(() => {
    if (type === "EDIT") {
      form.setFieldsValue({
        name: record?.name,
        stock: record?.stock,
        discount: record?.discount,
        details: record?.details,
        varient: record?.varient?.map((el) => ({
          ...el,
          images: el?.images?.split(",") || [],
          price: el?.price,
          name: el?.name,
          color: el?.color,
          compatibleDevices: el?.compatibleDevices?.split(",") || [],
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

      if (record?.varient?.[0]?.name) {
        setIsIphone(record.varient[0].name.includes("iPhone"));
      }
    } else {
      form.resetFields();
        setimages([]);
    }
  }, [form, record, type, visible]);

  // const handlePreview = async (file) => {
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  // };

  // const handleImageChange = async (info, key) => {
  //   const oldImages = [...images];
  //   setLoading(true);

  //   try {
  //     const uploadPromises = info.fileList
  //       .filter((file) => !isNil(file.originFileObj?.name))
  //       .map((file) => {
  //         const formData = new FormData();
  //         formData.append("images", file.originFileObj);

  //         if (!oldImages[key]) oldImages[key] = [];
  //         oldImages[key].push(`${serverURL}/images/${file.name}`);
  //         setImages(oldImages);

  //         return axios.post(`${serverURL}/api/upload`, formData, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });
  //       });

  //     await Promise.all(uploadPromises);
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     notification.error({ message: "Image upload failed" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFinish = async (values) => {
    // Validate colors
    for (const variant of values.varient || []) {
      if (
        variant.color !== "multicolor" &&
        !/^#[0-9A-F]{6,8}$/i.test(variant.color)
      ) {
        notification.error({
          message: `Invalid color format: ${variant.color}. Use hex format (#RRGGBB or #RRGGBBAA).`,
        });
        return;
      }
    }

    const config = {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    };

    const payload = {
      ...values,
      varient: values.varient?.map((el, key) => ({
        ...el,
        images: images[key]?.join(",") || "",
        price: Number(el.price),
        color: el.color?.toUpperCase(),
        compatibleDevices: Array.isArray(el.compatibleDevices)
          ? el.compatibleDevices.join(",")
          : el.compatibleDevices,
      })),
    };

    try {
      const url =
        type === "EDIT"
          ? `${serverURL}/api/v1/cases/${record?._id}`
          : `${serverURL}/api/v1/cases`;

      const method = type === "EDIT" ? "put" : "post";

      await axios[method](url, payload, config);
      notification.success({
        message: `Accessory ${
          type === "EDIT" ? "Updated" : "Created"
        } Successfully!`,
      });
      refetch();
      onCancel();
    } catch (err) {
      notification.error({
        message: `${type === "EDIT" ? "Update" : "Creation"} Failed!`,
      });
      console.error("API Error:", err);
    }
  };

  const ColorSelect = ({ value, onChange }) => {
    const [color, setColor] = useState(value || "#000000");
    const [pickerVisible, setPickerVisible] = useState(false);

    const handleColorChange = (newColor) => {
      setColor(newColor);
      onChange(newColor);
    };

    const colorPicker = (
      <div style={{ padding: 10 }}>
        <HexColorPicker color={color} onChange={handleColorChange} />
        <Input
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
    );

    return (
      <Space>
        <Select
          value={color}
          onChange={handleColorChange}
          style={{ width: 150 }}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Popover
                content={colorPicker}
                title="Custom Color"
                trigger="click"
                visible={pickerVisible}
                onVisibleChange={setPickerVisible}
              >
                <div
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => setPickerVisible(true)}
                >
                  <PlusOutlined /> Custom Color
                </div>
              </Popover>
            </div>
          )}
        >
          {colorOptions.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              <Space>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: value,
                    border: "1px solid #d9d9d9",
                    borderRadius: 2,
                  }}
                />
                {label}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Space>
    );
  };

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

  return (
    <Form form={form} onFinish={handleFinish}>
      <Modal
        title={type === "EDIT" ? "UPDATE ACCESSORY" : "CREATE ACCESSORY"}
        visible={visible}
        width={1000}
        onCancel={onCancel}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Card>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Accessory Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="discount"
                label="Discount Status"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "0", label: "No Discount" },
                    { value: "1", label: "Out of Stock" },
                    { value: "2", label: "Best Seller" },
                    { value: "3", label: "New Collection" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="details"
                label="Details"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Checkbox
                  checked={isIphone}
                  onChange={(e) => setIsIphone(e.target.checked)}
                >
                  iPhone Compatible
                </Checkbox>
                <Checkbox
                  checked={!isIphone}
                  onChange={(e) => setIsIphone(!e.target.checked)}
                  style={{ marginLeft: 16 }}
                >
                  Samsung Compatible
                </Checkbox>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.List name="varient">
                {(fields, { add, remove }) => (
                  <div style={{ marginBottom: 24 }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        style={{
                          marginBottom: 16,
                          borderLeft: "4px solid #1890ff",
                          borderRadius: 4,
                        }}
                        bodyStyle={{ padding: "16px 24px" }}
                      >
                        <Row gutter={16} align="middle">
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "compatibleDevices"]}
                              label={
                                <span style={{ fontWeight: 500 }}>
                                  Compatible Devices
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Please select devices",
                                },
                              ]}
                            >
                              <Select
                                mode="multiple"
                                showSearch
                                optionFilterProp="children"
                                placeholder="Select compatible devices"
                                style={{ width: "100%" }}
                                dropdownStyle={{ zIndex: 2000 }}
                              >
                                {(isIphone ? listIphone : listSam).map(
                                  (device) => (
                                    <Select.Option
                                      key={device.value}
                                      value={device.value}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {device.label}
                                      </div>
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "color"]}
                              label={
                                <span style={{ fontWeight: 500 }}>Color</span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Please select a color",
                                },
                                {
                                  pattern: /^#([0-9A-F]{6,8})|multicolor$/i,
                                  message:
                                    "Must be hex format (#RRGGBB) or 'multicolor'",
                                },
                              ]}
                            >
                              <ColorSelect />
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "price"]}
                              label={
                                <span style={{ fontWeight: 500 }}>
                                  Price ($)
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter price",
                                },
                                {
                                  type: "number",
                                  min: 0,
                                  message: "Price must be positive",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={0.01}
                                formatter={(value) =>
                                  `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col span={2} style={{ textAlign: "center" }}>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{
                                color: "#ff4d4f",
                                fontSize: 18,
                                cursor: "pointer",
                                marginTop: 30,
                              }}
                            />
                          </Col>
                        </Row>

                        <Form.Item shouldUpdate noStyle>
                          <Form.Item name={[name, "images"]} {...restField}>
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

                        <Image
                          style={{ display: "none" }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: setPreviewOpen,
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      </Card>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        height: 48,
                        borderRadius: 4,
                        borderStyle: "dashed",
                        borderColor: "#1890ff",
                        color: "#1890ff",
                      }}
                    >
                      Add New Variant
                    </Button>
                  </div>
                )}
              </Form.List>
            </Col>
          </Row>
        </Card>
      </Modal>
    </Form>
  );
};

export default CaseModalAddEdit;
