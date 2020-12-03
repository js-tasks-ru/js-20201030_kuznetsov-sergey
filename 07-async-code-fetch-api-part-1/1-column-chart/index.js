import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;
    loadingClassNameCSS = 'column-chart_loading';

    constructor({
        label = '',
        link = '',
        formatHeading = data => data,
        url = null,
        range = {
          from: new Date(),
          to: new Date(),
        }
    } = {}) {
        this.label = label;
        this.link  = link;
        this.formatHeading = formatHeading;
        this.url = url;
        this.range = range;
        this.url = url;
        this.loadURL = new URL(url, BACKEND_URL);

        this.render();
        this.update();
    }

    getTemplate() {
        return `
            <div class="column-chart" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${this.value}</div>
                    <div data-element="body" class="column-chart__chart"></div>
                </div>
            </div>
        `;
    }

    getLink() {
        if (this.link) {
            return `<a href=${this.link} class="column-chart__link">View all</a>`;
        } else {
            return '';
        }
    }
    
    render() {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate();
        this.element  = div.firstElementChild;
        this.element.classList.add(this.loadingClassNameCSS);
        this.initSubElements();
    }

    update(dateFrom, dateTo) {
        return this.getDataFromBackend(dateFrom, dateTo);
    }

    async getDataFromBackend(dateFrom = this.range.from, dateTo = this.range.to) {
        this.range.from = dateFrom;
        this.range.to = dateTo;

        this.loadURL.searchParams.set('from', dateFrom.toISOString());
        this.loadURL.searchParams.set('to', dateTo.toISOString());

        const result = await fetchJson(this.loadURL);
        this.updateDOM(result);
    }

    updateDOM(data = {}) {
        const entries = Object.entries(data);
        const values = Object.values(data);
        if (values.length > 0) {
            const maxValue = Math.max(...values); 
            const dataArray = entries.map(([key, value]) => {
                const valueDOM = Math.floor(value / maxValue * this.chartHeight);
                const percent = Math.round(value / maxValue * 100);
                return `<div style="--value:${valueDOM}" data-tooltip="${percent}%"></div>`; 
            });

            this.element.classList.remove(this.loadingClassNameCSS);
            this.subElements.body.innerHTML = dataArray.join('');

            const headerValue = values.reduce((a, b) => {
                return a + b;
            });
            this.subElements.header.innerHTML = this.formatHeading(headerValue);
        }
    }

    initSubElements() {
        const elements = this.element.querySelectorAll('[data-element]');
        for (const item of elements) {
            this.subElements[item.dataset.element] = item;
        }
    }

    remove () {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
