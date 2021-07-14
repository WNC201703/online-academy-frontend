import moment from "moment";

export const moneyFormat = (money) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(money);
}

export const ratingNumberFormat = (rating) => {
  let realRate = (rating * 5) / 10;
  return Number((realRate).toFixed(1));
}

export const dateFormat = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY");
}

export const discountFormat = (price, percent) => {
  let discountAmount = price * (percent / 100);
  return Number(discountAmount).toFixed(1);
}