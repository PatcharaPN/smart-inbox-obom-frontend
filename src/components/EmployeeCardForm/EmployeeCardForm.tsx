import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

type FormData = {
  firstName: string;
  nickname?: string;
  lastName: string;
  employeeId: string;
  department: string;
  note?: string;
  type: string;
  photo: FileList;
};

const EmployeeCardForm = ({ onClose }: { onClose: () => void }) => {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("employeeId", data.employeeId);
    formData.append("department", data.department);
    formData.append("type", data.type);
    formData.append("nickname", data.nickname ?? "");
    formData.append("note", data.note ?? "");
    formData.append("photo", data.photo[0]);
    formData.append("orientation", orientation); // ถ้ามี

    try {
      const response = await axios.post(
        "http://100.127.64.22:3000/employee-card/pdf",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ สร้างลิงก์ดาวน์โหลด
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EmployeeCard-${data.employeeId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert("ไม่สามารถสร้างบัตรพนักงานได้");
    }
  };

  const renderError = (
    error: string | { message?: string } | undefined | FieldErrors[string]
  ) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if ("message" in error && typeof error.message === "string")
      return error.message;
    return null;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* พื้นหลังมืด */}
      <motion.div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* กล่อง modal */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[100vh] relative bg-white rounded-xl text-black z-50 shadow-lg w-full max-w-3xl mx-4 flex flex-col overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 25, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 25, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">สร้างบัตรพนักงาน</h2>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* เลือกแนวตั้ง / แนวนอน */}
        <p className="mb-2 font-medium">เลือกรูปแบบของบัตรพนักงาน</p>
        <div className="flex gap-4 justify-center">
          {[
            { label: "แนวนอน", value: "horizontal", width: 60, height: 40 },
            { label: "แนวตั้ง", value: "vertical", width: 40, height: 60 },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`rounded-md cursor-pointer border-2 flex flex-col items-center px-4 py-2 transition-all ${
                orientation === opt.value
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setOrientation(opt.value as any)}
            >
              <div
                className="mb-2 rounded-sm bg-gray-400"
                style={{ width: opt.width, height: opt.height }}
              />
              <span className="text-sm">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* ตัวอย่างบัตร */}
        <div className="flex justify-center my-4">
          <img
            src={`/IDCard/${
              orientation === "horizontal" ? "Horizontal" : "Vertical"
            }.png`}
            alt="card-preview"
            className={`rounded-md border shadow ${
              orientation === "horizontal"
                ? "w-[300px] h-auto"
                : "h-[300px] w-auto"
            }`}
          />
        </div>

        {/* ฟอร์มข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium">ชื่อ</label>
            <input
              {...register("firstName", {
                required: "กรุณาใส่ชื่อ",
                minLength: { value: 2, message: "ชื่อสั้นเกินไป" },
                maxLength: { value: 50, message: "ชื่อยาวเกินไป" },
              })}
              className="input"
              placeholder="กรุณาใส่ชื่อ"
            />
            {errors.firstName?.message && (
              <p className="text-red-500 text-sm mt-1 py-1">
                {renderError(errors.firstName.message)}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">ชื่อเล่น</label>
            <input
              {...register("nickname")}
              className="input"
              placeholder="กรุณาใส่ชื่อเล่น"
            />
          </div>

          <div>
            <label className="font-medium">นามสกุล</label>
            <input
              {...register("lastName", {
                required: "กรุณาใส่นามสกุล",
                minLength: { value: 2, message: "นามสกุลสั้นเกินไป" },
                maxLength: { value: 50, message: "นามสกุลยาวเกินไป" },
              })}
              className="input"
              placeholder="กรุณาใส่นามสกุล"
            />
            {errors.lastName?.message && (
              <p className="text-red-500 text-sm mt-1 py-1">
                {renderError(errors.lastName.message)}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">เลขประจำตัวพนักงาน</label>
            <input
              {...register("employeeId", {
                required: "กรุณาใส่เลขประจำตัวพนักงาน",
                pattern: {
                  value: /^[A-Za-z0-9\-]+$/,
                  message: "เลขประจำตัวต้องเป็นตัวอักษรหรือตัวเลขเท่านั้น",
                },
              })}
              className="input"
              placeholder="กรุณาใส่เลขประจำตัว"
            />
            {errors.employeeId?.message && (
              <p className="text-red-500 text-sm mt-1 py-1">
                {renderError(errors.employeeId.message)}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">แผนก</label>
            <select
              {...register("department", { required: "กรุณาเลือกแผนก" })}
              className="input"
            >
              <option value="">กรุณาเลือกแผนก</option>
              <option value="production">ฝ่ายผลิต</option>
              <option value="Design">Design</option>
              <option value="FG">FG</option>
              <option value="qa">QA</option>
              <option value="hr">HR</option>
            </select>
            {errors.department?.message && (
              <p className="text-red-500 text-sm mt-1 py-1">
                {renderError(errors.department.message)}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">อื่นๆ</label>
            <input
              {...register("note")}
              className="input"
              placeholder="อื่นๆ"
            />
          </div>
        </div>

        {/* ประเภทพนักงาน */}
        <div className="mb-6">
          <p className="font-medium mb-2">ประเภทพนักงาน</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="ปกติ"
                {...register("type", { required: "กรุณาเลือกประเภทพนักงาน" })}
                defaultChecked
              />{" "}
              พนักงานปกติ
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="พาร์ทไทม์" {...register("type")} />{" "}
              พาร์ทไทม์
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="ฝึกงาน" {...register("type")} /> ฝึกงาน
            </label>
          </div>
          {errors.type?.message && (
            <p className="text-red-500 text-sm mt-1 py-1">
              {renderError(errors.type.message)}
            </p>
          )}
        </div>

        {/* อัปโหลดรูป */}
        <div className="mb-6">
          <p className="font-medium mb-1">อัปโหลดภาพพนักงาน</p>
          <p className="text-sm text-gray-500 mb-2">
            แนะนำว่า : เพื่อให้บัตรพนักงานดูสวยงามและเป็นมืออาชีพ
            กรุณาใช้เว็บไซต์{" "}
            <a
              href="https://www.remove.bg"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              remove.bg
            </a>{" "}
            เพื่อเอาพื้นหลังของรูปที่ถ่ายก่อนอัปโหลด
            ระบบจะนำรูปของคุณไปวางบนพื้นหลังสีฟ้าอัตโนมัติ
          </p>
          <input
            type="file"
            accept="image/*"
            {...register("photo", { required: "กรุณาอัปโหลดภาพพนักงาน" })}
            className="file:border-dashed file:border-2 file:border-gray-300 file:w-32 file:h-32 file:cursor-pointer"
          />
          {errors.photo?.message && (
            <p className="text-red-500 text-sm mt-1 py-1">
              {renderError(errors.photo.message)}
            </p>
          )}
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            onClick={() => alert("แสดง preview ยังไม่ทำงาน")}
          >
            แสดงตัวอย่าง
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            สร้างบัตรพนักงาน
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EmployeeCardForm;
