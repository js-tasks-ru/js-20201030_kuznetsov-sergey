export default class ColumnChart {
    chartHeight = 50;

    constructor(options = {}) {
        this.data  = options.data;
        this.label = options.label;
        this.value = options.value;
        this.link  = options.link;

        this.render();
        this.initEventListeners();
    }
    
    render() {
        this._renderElement();
        this._renderTitle();
        this._renderValue();
        this._renderData();
    }

    update() {
        this.element.querySelector('.column-chart__chart').innerHTML = '';
        this._renderData();
    }

    _renderElement() {
        this.element = document.createElement('div');
        this.element.className = 'column-chart';

        this.element.innerHTML = `
        <div class="column-chart__title">
        </div>
        <div class="column-chart__container">
            <div data-element="body" class="column-chart__chart">
            </div>
        </div>
        `;
    }

    _renderTitle() {
        const title = this.element.querySelector('.column-chart__title');

        if (this.label !== undefined) {
            title.innerHTML = this.label;
        }

        if (this.link !== undefined) {
            const link = `<a href="${this.link}" class="column-chart__link">View all</a>`;
            title.innerHTML += link;
        }
    }

    _renderValue() {
        const container = this.element.querySelector('.column-chart__container');

        if (this.value !== undefined) {
            const title = `<div data-element="header" class="column-chart__header">${this.value}</div>`;
            container.innerHTML = title + container.innerHTML;
        }
    }

    _renderData() {
        if (Array.isArray(this.data) && this.data.length > 0) {
            const maxValue = Math.max(...this.data);
            const dataBody = this.element.querySelector('.column-chart__chart');

            for (const item of this.data) {
                const value = Math.floor(item / maxValue * this.chartHeight);
                const percent = Math.round(item / maxValue * 100);
                const div = `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`;
                dataBody.innerHTML += div;
            }
        } else {
            this.element.className += ' column-chart_loading';
        }
    }

    initEventListeners () {

    }

    remove () {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
