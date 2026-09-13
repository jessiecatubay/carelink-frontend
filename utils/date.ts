export const PHILIPPINE_TIME_ZONE = "Asia/Manila";

const PHILIPPINE_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: PHILIPPINE_TIME_ZONE,
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  year: "numeric",
};

export const formatPhilippineDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return date.toLocaleString("en-PH", PHILIPPINE_DATE_TIME_OPTIONS);
};

export const formatPhilippineTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return date
    .toLocaleTimeString("en-PH", {
      timeZone: PHILIPPINE_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

export const formatPhilippineDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-PH", {
    timeZone: PHILIPPINE_TIME_ZONE,
  });
};

export const isSamePhilippineDay = (firstValue: string, secondValue: string) =>
  formatPhilippineDate(firstValue) === formatPhilippineDate(secondValue);
