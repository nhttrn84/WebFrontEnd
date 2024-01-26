export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDateAndTime = (inputString) => {
  const date = new Date(inputString);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  };

  return date.toLocaleString("en-US", options);
};
