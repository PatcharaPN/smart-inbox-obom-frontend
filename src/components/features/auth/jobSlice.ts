interface JobApplicant {
  _id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  birthDate: string;
  address: {
    district: string;
    province: string;
    postalCode: string;
  };
  phone: string;
  email: string;
  application: {
    applyPosition: string;
    expectedSalary: string;
    availableDate: string;
    educationLevel: string;
    institution: string;
    faculty: string;
    educationDetails?: string;
    jobTypesInterested: string[];
  };
  attachment: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobState {
  applicant: JobApplicant[];
  loading: boolean;
  error: string | null;
}
