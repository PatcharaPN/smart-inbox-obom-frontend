import {
  Divider,
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Modal as AntModal,
  Select,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Modal from "../../components/Modal/Modal";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import { useState } from "react";
import { Icon } from "@iconify/react";

const { Option } = Select;

// ประเภทของข้อมูลผู้สมัคร
const data: Applicant[] = [
  {
    key: "1",
    name: "สมชาย ใจดี",
    position: "วิศวกร",
    dateApplied: "2025-06-24",
    email: "somchai@example.com",
    attachmentUrl: "/files/somchai-resume.pdf",
    status: "รอดำเนินการ",
  },
  {
    key: "2",
    name: "สมหญิง สมบัติ",
    position: "นักออกแบบ",
    dateApplied: "2025-06-23",
    email: "somying@example.com",
    attachmentUrl: "/files/somying-resume.pdf",
    status: "ผ่านการคัดเลือก",
  },
  {
    key: "3",
    name: "วิทวัส พัฒน์ดี",
    position: "นักการตลาด",
    dateApplied: "2025-06-22",
    email: "witwat@example.com",
    attachmentUrl: "/files/witwat-resume.pdf",
    status: "ไม่ผ่าน",
  },
  {
    key: "4",
    name: "กาญจนา สมใจ",
    position: "ผู้จัดการฝ่ายบุคคล",
    dateApplied: "2025-06-21",
    email: "kanjana@example.com",
    attachmentUrl: "/files/kanjana-resume.pdf",
    status: "รอดำเนินการ",
  },
  {
    key: "5",
    name: "ธนพล สวัสดิ์",
    position: "นักพัฒนาเว็บ",
    dateApplied: "2025-06-20",
    email: "tanapon@example.com",
    attachmentUrl: "/files/tanapon-resume.pdf",
    status: "ผ่านการคัดเลือก",
  },
  {
    key: "6",
    name: "ปัทมา ใจงาม",
    position: "นักวิเคราะห์ข้อมูล",
    dateApplied: "2025-06-19",
    email: "patama@example.com",
    attachmentUrl: "/files/patama-resume.pdf",
    status: "ไม่ผ่าน",
  },
];

const HRApplicationPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // State เปิด/ปิด modal ดูข้อมูล
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  const onDelete = (name: string) => {
    AntModal.confirm({
      title: "ยืนยันการลบ",
      content: `คุณต้องการลบผู้สมัคร ${name} ใช่หรือไม่?`,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: () => {
        message.success(`ลบผู้สมัคร ${name} แล้ว`);
      },
    });
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicant(null);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const columns: ColumnsType<Applicant> = [
    {
      title: "อันดับ",
      key: "index",
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "ตำแหน่งที่สมัคร",
      dataIndex: "position",
      key: "position",
      width: 150,
    },
    {
      title: "วันที่สมัคร",
      dataIndex: "dateApplied",
      key: "dateApplied",
      width: 120,
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "ไฟล์แนบ",
      dataIndex: "attachmentUrl",
      key: "attachmentUrl",
      width: 100,
      align: "center",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div className="flex justify-center items-center h-full">
            <Icon icon="mdi:attachment" width="20" className="text-gray-600" />
          </div>
        </a>
      ),
    },
    {
      title: "สถานะการสมัคร",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        let color = "default";
        if (status === "ผ่านการคัดเลือก") color = "green";
        else if (status === "ไม่ผ่าน") color = "red";
        else color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "จัดการ",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="ดูข้อมูล">
            <Button
              type="text"
              shape="circle"
              icon={<Icon icon="mdi:eye-outline" width="18" />}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200"
              onClick={() => showDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="เปลี่ยนสถานะ">
            <Button
              type="text"
              shape="circle"
              icon={<Icon icon="mdi:swap-horizontal" width="18" />}
              className="bg-orange-50 text-orange-600 hover:bg-orange-100 transition duration-200"
            />
          </Tooltip>
          <Tooltip title="ดาวน์โหลดข้อมูล">
            <Button
              type="text"
              shape="circle"
              icon={<Icon icon="mdi:download-outline" width="18" />}
              className="bg-green-50 text-green-600 hover:bg-green-100 transition duration-200"
            />
          </Tooltip>
          <Tooltip title="ลบการสมัคร">
            <Button
              type="text"
              shape="circle"
              icon={<Icon icon="mdi:trash-can-outline" width="18" />}
              className="bg-red-50 text-red-600 hover:bg-red-100 transition duration-200"
              onClick={() => onDelete(record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // กรองข้อมูล
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const { Option } = Select;

  // เพิ่ม state สำหรับสถานะใหม่ที่เลือกใน modal
  const [newStatus, setNewStatus] = useState<Applicant["status"] | null>(null);

  // ตอนเปิด modal ให้เซ็ตสถานะเดิมไว้
  const showDetailModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setNewStatus(applicant.status); // เซ็ตสถานะเดิม
    setIsDetailModalOpen(true);
  };

  // ฟังก์ชันบันทึกสถานะใหม่
  const saveStatus = () => {
    if (
      selectedApplicant &&
      newStatus &&
      newStatus !== selectedApplicant.status
    ) {
      // ในนี้สามารถเพิ่ม logic update ข้อมูลจริง เช่น API call
      message.success(
        `เปลี่ยนสถานะของ ${selectedApplicant.name} เป็น '${newStatus}' เรียบร้อยแล้ว`
      );
      // อัปเดตข้อมูลใน data หรือ state ตามจริง (ในนี้ใช้ mock data เลยไม่ทำ)
      // ปิด modal
      closeDetailModal();
    } else {
      message.info("กรุณาเลือกสถานะใหม่ที่ต่างจากสถานะเดิม");
    }
  };
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold pb-4 text-gray-800 flex items-center gap-2">
        <Icon icon="mdi:account-box-multiple-outline" width={32} />
        รายชื่อผู้สมัคร
      </h1>

      <Modal>
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[70vw] 2xl:w-[77vw] h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="grid grid-cols-[1fr_0.4fr] gap-3 w-2/3 items-center">
              <SearchBarComponent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />{" "}
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                className="w-full"
              >
                <Option value="all">กรองทั้งหมด</Option>
                <Option value="รอดำเนินการ">รอดำเนินการ</Option>
                <Option value="ผ่านการคัดเลือก">ผ่านการคัดเลือก</Option>
                <Option value="ไม่ผ่าน">ไม่ผ่าน</Option>
              </Select>
            </div>

            <Button
              icon={<Icon icon="mdi:export-variant" />}
              className="rounded-full"
            >
              ส่งออก
            </Button>
          </div>

          <Divider />

          {/* ตาราง */}
          <div className="flex-1 overflow-auto">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 11 }}
              scroll={{ y: "100%" }} // กินพื้นที่สูงเต็ม div ครอบ
              bordered
              className="rounded-lg"
              rowClassName="hover:bg-gray-50 transition"
              locale={{ emptyText: "ไม่มีข้อมูลผู้สมัครในขณะนี้" }}
            />
          </div>
        </div>
      </Modal>

      {/* Modal ดูข้อมูลรายละเอียดผู้สมัคร */}
      <AntModal
        title={`ข้อมูลผู้สมัคร: ${selectedApplicant?.name ?? ""}`}
        open={isDetailModalOpen}
        onCancel={closeDetailModal}
        footer={[
          <Button key="cancel" onClick={closeDetailModal}>
            ยกเลิก
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={saveStatus}
            disabled={newStatus === selectedApplicant?.status}
          >
            บันทึก
          </Button>,
        ]}
        width={600}
      >
        {selectedApplicant ? (
          <div className="space-y-3 text-gray-700">
            <p>
              <b>ตำแหน่งที่สมัคร:</b> {selectedApplicant.position}
            </p>
            <p>
              <b>วันที่สมัคร:</b> {selectedApplicant.dateApplied}
            </p>
            <p>
              <b>อีเมล:</b> {selectedApplicant.email}
            </p>
            <p>
              <b>ไฟล์แนบ:</b>{" "}
              <a
                href={selectedApplicant.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                ดูไฟล์
              </a>
            </p>
            <p>
              <b>สถานะการสมัคร:</b>{" "}
              <Select
                value={newStatus}
                onChange={(value) => setNewStatus(value)}
                style={{ width: 180 }}
              >
                <Option value="รอดำเนินการ">รอดำเนินการ</Option>
                <Option value="ผ่านการคัดเลือก">ผ่านการคัดเลือก</Option>
                <Option value="ไม่ผ่าน">ไม่ผ่าน</Option>
              </Select>
            </p>
            <p>
              <b>หมายเหตุเพิ่มเติม:</b> ข้อมูลนี้เป็นตัวอย่าง mockup
            </p>
          </div>
        ) : (
          <p>ไม่มีข้อมูลผู้สมัคร</p>
        )}
      </AntModal>
    </div>
  );
};

export default HRApplicationPage;
