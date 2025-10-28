import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppDispatch } from "../../redux/store";
import { fetchEmployeeCards } from "../features/employeeCardSlice";
import { toast } from "react-toastify";
import type { Area } from "react-easy-crop";
export type FormData = {
  _id: string;
  firstName: string;
  nickname: string;
  lastName: string;
  employeeId: string;
  department: string;
  note?: string;
  employeeType: string;
  imagePath: string;
  photo: File[];
  cardType: "horizontal" | "vertical";
};

const EmployeeCardForm = ({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: Partial<FormData>;
}) => {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const dispatch = useAppDispatch();
  const [croppedAreaPixels, _] = useState<Area | null>(null);
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      cardType: "horizontal",
      note: "",
    },
  });
  const getCroppedImage = async () => {
    if (!croppedAreaPixels) {
      console.warn("Cropped area is not set yet.");
      return null;
    }

    const image = await createImage(URL.createObjectURL(watch("photo")[0]));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx?.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    });
  };

  const watchDepartment = watch("department");
  const watchNote = watch("note");
  const actualDepartment =
    watchDepartment === "other"
      ? watchNote || "แผนก"
      : watchDepartment || "แผนก";
  const cardTypeValue = watch("cardType");
  const department = watch("department");

  const isOtherDepartment = department === "other";
  console.log("Current cardType:", cardTypeValue);
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("cardType", data.cardType);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("employeeId", data.employeeId);
    formData.append("employeeType", data.employeeType);
    formData.append("nickname", data.nickname ?? "");
    const actualDepartment =
      data.department === "other" ? data.note ?? "" : data.department;
    formData.append("department", actualDepartment);

    if (data.photo && data.photo.length > 0) {
      formData.append("photo", data.photo[0]);
    }
    if (data.photo && data.photo.length > 0) {
      const croppedFile = await getCroppedImage();
      formData.append("photo", croppedFile as File);
    }
    try {
      if (initialData?._id) {
        // 🔄 อัปเดต
        await axios.put(
          `https://one.obomgauge.com/api/employee-card/edit/${initialData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("อัปเดตบัตรพนักงานสำเร็จ 🎉", {});
      } else {
        // 🆕 สร้างใหม่
        const response = await axios.post(
          "https://one.obomgauge.com/api/employee-card/pdf",
          formData,
          {
            responseType: "blob",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `EmployeeCard-${data.employeeId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast.success("สร้างบัตรพนักงานสำเร็จ 🎉", {
          /* ... */
        });
      }

      dispatch(fetchEmployeeCards());
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("เกิดข้อผิดพลาด ❌");
    }
  };
  useEffect(() => {
    if (initialData) {
      for (const key in initialData) {
        if (initialData[key as keyof FormData] !== undefined) {
          setValue(
            key as keyof FormData,
            initialData[key as keyof FormData] as any
          );
        }
      }

      const knownDepartments = [
        "Design",
        "PM/BK",
        "QC",
        "Planning",
        "Purchase",
        "Sale Support",
        "Account",
        "CG",
        "AS",
        "FG",
        "qa",
        "HR",
      ];
      if (
        initialData.department &&
        !knownDepartments.includes(initialData.department)
      ) {
        setValue("department", "other");
        setValue("note", initialData.department);
      }

      if (
        initialData.cardType === "vertical" ||
        initialData.cardType === "horizontal"
      ) {
        setOrientation(initialData.cardType);
      }
    }
  }, [initialData, setValue]);
  const renderError = (
    error: string | { message?: string } | undefined | FieldErrors[string]
  ) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if ("message" in error && typeof error.message === "string")
      return error.message;
    return null;
  };
  // useEffect(() => {
  //   if (department === "other") {
  //     setValue("department", customDepartment || "");
  //   }
  // }, [customDepartment]);

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
        className="h-[87vh] relative bg-white rounded-xl text-black z-50 shadow-lg w-full max-w-7xl mx-4 flex flex-col md:flex-row gap-6 overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 25, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 25, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {" "}
        <div className="aspect-[2/3] h-full flex items-center justify-center">
          {" "}
          <div className="relative">
            {/* Layer ที่แสดงข้อมูลบนบัตร */}
            <div className="flex justify-center my-4 relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={orientation}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative pointer-events-none"
                >
                  {/* พื้นหลังบัตร */}
                  <img
                    src={`/IDCard/${
                      orientation === "horizontal" ? "Horizontal" : "Vertical"
                    }.png`}
                    alt="card-preview"
                    className={`rounded-md border shadow ${
                      orientation === "horizontal" ? "w-[500px]" : "h-[500px]"
                    }`}
                  />

                  {/* Overlay ข้อมูล */}
                  {orientation === "horizontal" ? (
                    <>
                      {/* ข้อความแนวนอน */}
                      <div className="absolute top-24 left-16 flex flex-col gap-1 text-white text-xl">
                        <p>
                          {watch("firstName") ?? "ชื่อ"} (
                          {watch("nickname") ?? "ชื่อเล่น"})
                        </p>
                        <p>{watch("lastName") ?? "นามสกุล"}</p>
                        <p>ID : {watch("employeeId") ?? "รหัสพนักงาน"}</p>
                        <p>Section : {actualDepartment}</p>
                      </div>

                      {/* รูปภาพแนวนอน */}
                      {watch("photo")?.[0] ? (
                        <img
                          src={URL.createObjectURL(watch("photo")[0])}
                          alt="preview"
                          className="absolute top-17.5 right-8 w-[165px] h-[165px] object-cover rounded-full border-2 border-white"
                        />
                      ) : initialData?.imagePath ? (
                        <img
                          src={`https://one.obomgauge.com/api/${initialData.imagePath}`}
                          alt="preview"
                          className="absolute top-17.5 right-8 w-[165px] h-[165px] object-cover rounded-full border-2 border-white"
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      {/* รูปภาพแนวตั้ง */}

                      {watch("photo")?.[0] ? (
                        <img
                          src={URL.createObjectURL(watch("photo")[0])}
                          alt="preview"
                          className="absolute top-19 right-16 w-[180px] h-[180px] object-cover rounded-full border-2 border-white"
                        />
                      ) : initialData?.imagePath ? (
                        <img
                          src={`https://one.obomgauge.com/api/${initialData.imagePath}`}
                          alt="preview"
                          className="absolute top-19 right-16 w-[180px] h-[180px] object-cover rounded-full border-2 border-white"
                        />
                      ) : null}

                      {/* ข้อความแนวตั้ง */}
                      <div className="absolute top-[315px] left-1/2 -translate-x-1/2 flex flex-col items-start gap-1 text-white text-lg">
                        <p>
                          {watch("firstName") ?? "ชื่อ"} (
                          {watch("nickname") ?? "ชื่อเล่น"})
                        </p>
                        <p>{watch("lastName") ?? "นามสกุล"}</p>
                        <p>ID : {watch("employeeId") ?? "รหัสพนักงาน"}</p>
                        <p>Section : {watch("department") ?? "แผนก"}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* เลือกแนวตั้ง / แนวนอน */}
        {/* ตัวอย่างบัตร */}
        <div>
          {" "}
          <div className="flex items-center justify-between">
            <p className="font-medium">เลือกรูปแบบของบัตรพนักงาน</p>
            <Icon
              className="cursor-pointer"
              onClick={onClose}
              icon="basil:cross-solid"
              width="24"
              height="24"
            />
          </div>
          <div className="py-2 flex gap-4 justify-center">
            {[
              { label: "แนวนอน", value: "horizontal", aspect: "aspect-[4/3]" },
              { label: "แนวตั้ง", value: "vertical", aspect: "aspect-[3/4]" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rounded-md justify-between cursor-pointer border-2 flex flex-col items-center px-4 py-2 transition-all ${
                  orientation === opt.value
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => {
                  setOrientation(opt.value as "horizontal" | "vertical");
                  setValue("cardType", opt.value as "horizontal" | "vertical");
                }}
              >
                <div
                  className={`w-[60px] ${opt.aspect} bg-gray-400 rounded-sm`}
                />
                <span className="text-sm mt-2">{opt.label}</span>
              </button>
            ))}

            <input
              type="hidden"
              {...register("cardType", { required: "กรุณาเลือกรูปแบบบัตร" })}
            />
          </div>{" "}
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
                <option value="Design">Design</option>
                <option value="PM/BK">PM/BK</option>
                <option value="QC">QC</option>
                <option value="Planning">Planning</option>
                <option value="Purchase">Purchase</option>
                <option value="Sale Support">Sale Support</option>
                <option value="Account">Account</option>
                <option value="CG">CG</option>
                <option value="AS">AS</option>
                <option value="FG">FG</option>
                <option value="qa">QA</option>
                <option value="HR">HR</option>
                <option value="other">อื่นๆ (กรอกเอง)</option>
              </select>
              {errors.department?.message && (
                <p className="text-red-500 text-sm mt-1 py-1">
                  {renderError(errors.department.message)}
                </p>
              )}
            </div>
            <div>
              <label className="font-medium">อื่นๆ</label>
              {isOtherDepartment && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    className="input"
                    placeholder="กรุณาระบุชื่อแผนก"
                    {...register("note", {
                      required: "กรุณาระบุชื่อแผนก",
                    })}
                  />
                  {errors.note?.message && (
                    <p className="text-red-500 text-sm mt-1 py-1">
                      {renderError(errors.note.message)}
                    </p>
                  )}
                </motion.div>
              )}
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
                  {...register("employeeType", {
                    required: "กรุณาเลือกประเภทพนักงาน",
                  })}
                  defaultChecked
                />{" "}
                พนักงานปกติ
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="พาร์ทไทม์"
                  {...register("employeeType")}
                />{" "}
                พาร์ทไทม์
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="ฝึกงาน"
                  {...register("employeeType")}
                />{" "}
                ฝึกงาน
              </label>
            </div>
            {errors.employeeType?.message && (
              <p className="text-red-500 text-sm mt-1 py-1">
                {renderError(errors.employeeType.message)}
              </p>
            )}
          </div>
          {/* อัปโหลดรูป */}{" "}
          <div className="mb-6 flex flex-col  justify-between">
            <div>
              {" "}
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
            </div>
            <div className="flex  justify-between items-end gap-4">
              {" "}
              <div>
                {" "}
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo", {
                    validate: (files) => {
                      if (files?.length > 0) return true;
                      if (initialData?.imagePath) return true;
                      return "กรุณาอัปโหลดภาพพนักงาน";
                    },
                  })}
                  className="file:border-dashed file:border-2 file:border-gray-300 file:w-32 file:h-32 file:cursor-pointer"
                />
                {errors.photo?.message && (
                  <p className="text-red-500 text-sm mt-1 py-1">
                    {renderError(errors.photo.message)}
                  </p>
                )}{" "}
              </div>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                สร้างบัตรพนักงาน
              </button>
            </div>
          </div>{" "}
          <div className="flex justify-end gap-3 mt-6">
            {/* <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => alert("แสดง preview ยังไม่ทำงาน")}
            >
              แสดงตัวอย่าง
            </button> */}
          </div>
        </div>
        {/* ปุ่ม */}
      </motion.form>
    </motion.div>
  );
};

export default EmployeeCardForm;
