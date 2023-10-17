import moment from 'moment';

export const formatDate = (dateStr: any) => {
  const date = new Date(dateStr);
  return moment(date).format('DD/MM/YY');
  // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
