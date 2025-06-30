import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";
import type { AuthState } from "./authSlice";

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

const initialState: JobState = {
  applicant: [],
  loading: false,
  error: null,
};

export const fetchApplicant = createAsyncThunk(
  "fetchApplicant",
  async (formData: FormData, { rejectWithValue }) => {
    try {
        
    } catch (error) {
        
    }
  }
);
