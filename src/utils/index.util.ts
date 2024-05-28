import moment from "moment";

export const checkExpireDate = (end_date: string) => {
  let now = moment();
  if (now > moment(end_date)) {
    // date is past
    return true;
  } else {
    return false;
    // date is future
  }
};

export const checkValidationDate = (start_date: string, end_date: string) => {
  let now = moment();
  if (moment(start_date) == moment(end_date)) {
    return false;
  }
  if (moment(start_date) > moment(end_date)) {
    return false;
  }
  if (moment(start_date) < now || moment(end_date) < now) {
    return false;
  }
  return true;
};

export const checkIsNew = (date: string) => {
  let weekLater = new Date();
  weekLater.setDate(new Date(date).getDate() + 7);
  if (new Date() > weekLater) {
    return false;
  } else {
    return true;
  }
};
