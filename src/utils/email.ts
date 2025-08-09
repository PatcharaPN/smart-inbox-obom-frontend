import type { Dayjs } from "dayjs";

// utils/email.ts
export const buildEmailFetchUrl = ({
  baseUrl,
  page,
  limit,
  userId,
  selectedYear,
  searchTerm,
  folder,
  range,
}: {
  baseUrl: string;
  page: number;
  limit: number;
  userId: string;
  selectedYear: string;
  searchTerm: string;
  folder: string;
  range: [Dayjs | null, Dayjs | null];
}) => {
  let url = `${baseUrl}`;
  const isFilteringByDate = range[0] && range[1];

  url += isFilteringByDate
    ? `/filter-by-date?page=${page}&limit=${limit}&userId=${userId}`
    : `/emails?page=${page}&limit=${limit}&userId=${userId}`;

  if (selectedYear !== "all") url += `&year=${selectedYear}`;
  if (searchTerm.trim() !== "") url += `&search=${searchTerm}`;
  if (folder !== "all") url += `&folder=${folder}`;

  if (isFilteringByDate) {
    url += `&startDate=${range[0]!.format(
      "YYYY-MM-DD"
    )}&endDate=${range[1]!.format("YYYY-MM-DD")}`;
  }

  return url;
};
