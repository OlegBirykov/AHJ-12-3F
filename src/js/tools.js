import moment from 'moment';

export const newsUrl = 'https://ahj-12-2.herokuapp.com/news/broken';
export const imagesUrl = 'https://ahj-12-2.herokuapp.com/images/';

export function getISODateTime(datetime) {
  return moment(datetime).format('YYYY-MM-DDTHH:mm');
}

export function getTextDateTime(datetime) {
  return moment(datetime).format('HH:mm DD.MM.YYYY');
}
