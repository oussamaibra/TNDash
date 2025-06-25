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
  notification
} from "antd";
import { useForm } from "antd/lib/form/Form";
import {
  MinusCircleOutlined,
  PlusOutlined,
  VerticalAlignTopOutlined
} from "@ant-design/icons";
import { isNil, isEmpty } from "lodash";
import TextArea from "antd/lib/input/TextArea";
import { HexColorPicker } from "react-colorful";
import axios from "axios";

const CaseModalAddEdit = (props) => {
  const { visible, onCancel, type, record, refetch } = props;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isIphone, setIsIphone] = useState(true);
  const [form] = useForm();

  // Color options with hex values
  const colorOptions = [
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#FF0000', label: 'Red' },
    { value: '#0000FF', label: 'Blue' },
    { value: '#008000', label: 'Green' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#FFC0CB', label: 'Pink' },
    { value: '#800080', label: 'Purple' },
    { value: '#FFD700', label: 'Gold' },
    { value: '#C0C0C0', label: 'Silver' },
    { value: '#00FFFFFF', label: 'Transparent' },
    { value: 'multicolor', label: 'Multicolor' },
  ];

  // iPhone and Samsung device lists (truncated for brevity)
  const listIphone = [
    { value: "iPhone 16 Pro Max", label: "iPhone 16 Pro Max" },
    // ... other iPhone models
  ];

  const listSam = [
    { value: "Samsung Galaxy S6", label: "Samsung Galaxy S6" },
    // ... other Samsung models
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

      const imageList = record?.varient?.map(el => 
        isEmpty(el?.images?.split(",")) ? [] : el?.images?.split(",")
      ) || [];
      setImages(imageList);
      
      if (record?.varient?.[0]?.name) {
        setIsIphone(record.varient[0].name.includes("iPhone"));
      }
    } else {
      form.resetFields();
      setImages([]);
    }
  }, [form, record, type, visible]);

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleImageChange = async (info, key) => {
    const oldImages = [...images];
    setLoading(true);
    
    try {
      const uploadPromises = info.fileList
        .filter(file => !isNil(file.originFileObj?.name))
        .map(file => {
          const formData = new FormData();
          formData.append("images", file.originFileObj);

          if (!oldImages[key]) oldImages[key] = [];
          oldImages[key].push(`${serverURL}/images/${file.name}`);
          setImages(oldImages);

          return axios.post(`${serverURL}/api/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        });

      await Promise.all(uploadPromises);
    } catch (err) {
      console.error("Upload error:", err);
      notification.error({ message: "Image upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    // Validate colors
    for (const variant of values.varient || []) {
      if (variant.color !== 'multicolor' && !/^#[0-9A-F]{6,8}$/i.test(variant.color)) {
        notification.error({ 
          message: `Invalid color format: ${variant.color}. Use hex format (#RRGGBB or #RRGGBBAA).` 
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
      const url = type === "EDIT" 
        ? `${serverURL}/api/v1/cases/${record?._id}`
        : `${serverURL}/api/v1/cases`;
      
      const method = type === "EDIT" ? "put" : "post";
      
      await axios[method](url, payload, config);
      notification.success({ 
        message: `Accessory ${type === "EDIT" ? "Updated" : "Created"} Successfully!` 
      });
      refetch();
      onCancel();
    } catch (err) {
      notification.error({ 
        message: `${type === "EDIT" ? "Update" : "Creation"} Failed!` 
      });
      console.error("API Error:", err);
    }
  };

  const ColorSelect = ({ value, onChange }) => {
    const [color, setColor] = useState(value || '#000000');
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
                  style={{ padding: '8px', cursor: 'pointer' }} 
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
                <div style={{
                  width: 14,
                  height: 14,
                  backgroundColor: value,
                  border: '1px solid #d9d9d9',
                  borderRadius: 2
                }} />
                {label}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Space>
    );
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
                <InputNumber style={{ width: '100%' }} />
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
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key}>
                        <Row gutter={16} align="middle">
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "compatibleDevices"]}
                              label="Compatible Devices"
                              rules={[{ required: true }]}
                            >
                              <Select
                                mode="multiple"
                                showSearch
                                optionFilterProp="children"
                              >
                                {(isIphone ? listIphone : listSam).map(device => (
                                  <Select.Option key={device.value} value={device.value}>
                                    {device.label}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "color"]}
                              label="Color"
                              rules={[
                                { required: true },
                                {
                                  pattern: /^#([0-9A-F]{6,8})|multicolor$/i,
                                  message: "Invalid color format"
                                }
                              ]}
                            >
                              <ColorSelect />
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "price"]}
                              label="Price"
                              rules={[{ required: true }]}
                            >
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Col>

                          <Col span={2}>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ color: '#ff4d4f' }}
                            />
                          </Col>
                        </Row>

                        <Form.Item
                          {...restField}
                          name={[name, "images"]}
                          label="Images"
                        >
                          <Upload
                            listType="picture-card"
                            fileList={images[key]?.map((url, i) => ({
                              uid: `-${i}`,
                              name: url,
                              status: 'done',
                              url,
                            })) || []}
                            onPreview={handlePreview}
                            onChange={(info) => handleImageChange(info, key)}
                            multiple
                          >
                            <Button icon={<VerticalAlignTopOutlined />}>
                              Upload Images
                            </Button>
                          </Upload>
                        </Form.Item>

                        <Image
                          style={{ display: 'none' }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: setPreviewOpen,
                            afterOpenChange: (visible) => !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      </div>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Variant
                      </Button>
                    </Form.Item>
                  </>
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