import {
  newsUrl, imagesUrl, getISODateTime, getTextDateTime,
} from './tools';

export default class NewsWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'news-widget',
      header: 'header',
      title: 'title',
      uploadLink: 'upload-link',
      news: 'news',
      new: 'new',
      datetime: 'datetime',
      newContainer: 'new-container',
      newImageContainer: 'new-image-container',
      newImage: 'new-image',
      newTextContainer: 'new-text-container',
      newText: 'new-text',
      error: 'error',
    };
  }

  static get markup() {
    return `
      <div class="${this.classes.header}">
        <h1 class="${this.classes.title}">
          Новости мира кино
        </h1>
        <a class="${this.classes.uploadLink}" href=".">
          Обновить
        </a>
      </div>
      <div class="${this.classes.news}">
      </div>
      <p class="${this.classes.error} hidden">
        Проблемы с соединением, показаны данные из кеша
      </p>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.uploadLink = this.widget.querySelector(`.${this.classes.uploadLink}`);
    this.news = this.widget.querySelector(`.${this.classes.news}`);
    this.error = this.widget.querySelector(`.${this.classes.error}`);

    this.uploadLink.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.requestNews();
    });

    this.parentEl.append(this.widget);

    navigator.serviceWorker.addEventListener('message', async (evt) => {
      if (evt.data === 'ready') {
        this.hideError();
      } else {
        this.showError();
      }
    });

    this.requestNews();
  }

  async requestNews() {
    const response = await fetch(newsUrl);
    this.redrawNews(await response.json());
  }

  redrawNews(news) {
    const newContent = news.reduce((html, item) => `${html}
      <div class="${this.classes.new}">
        <time class="${this.classes.datetime}" datetime="${getISODateTime(item.timestamp)}">
          ${getTextDateTime(item.timestamp)}
        </time>
        <div class="${this.classes.newContainer}">
          <div class="${this.classes.newImageContainer}">
            <img class="${this.classes.newImage}" src="${imagesUrl}${item.image}" alt="new" width="50" height="50">
          </div>
          <div class="${this.classes.newTextContainer}">
            <span class="${this.classes.newText}">${item.text}</span>
          </p>
        </div>
      </div>
    `, '');

    this.news.innerHTML = newContent;
  }

  showError() {
    this.error.classList.remove('hidden');
  }

  hideError() {
    this.error.classList.add('hidden');
  }
}
