import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements = {};
    order = {
        asc: 1,
        desc: -1
    };
    data = [];
    
    constructor(
        header = [], {
            url = null,
            start = 0,
            step = 20   
        } = {}
    ) {
        this.header = header;
        this.loadURL = new URL(url, BACKEND_URL);
        this.sortMethod = {
            'string': this.sortByString,
            'number': this.sortByNumber
        }
        this.start = start;
        this.step = step;
        this.end = start + step;
        this.sortOnClient = false;
        this.render(); 
    }

    async render() {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate();
        this.element  = div.firstElementChild;
        this.initArrow();
        this.initSubElements();
        this.initEventListeners();
        this.initDefaultSort();
        await this.loadData();
    }

    async sortOnServer(id, order) {
        this.start = 0;
        await this.loadData('update');
    }

    async loadData(method = 'add') {
        const {id, order} = this.currentHeaderColumn.dataset;
        this.loadURL.searchParams.set('_sort', id);
        this.loadURL.searchParams.set('_order', order);
        this.loadURL.searchParams.set('_start', this.start);
        this.loadURL.searchParams.set('_end', this.end);

        this.element.classList.add('sortable-table_loading');
        const data = await fetchJson(this.loadURL);
        if (method === 'add') {
            this.data = this.data.concat(data);
        } else if (method === 'update') {
            this.data = data;
        }
        
        this.element.classList.remove('sortable-table_loading');

        const dataDOM = this.renderData(this.data);
        this.subElements.body.innerHTML = dataDOM.join('');
    }

    initEventListeners() {
        this.subElements.header.addEventListener('pointerdown', event => {
            const target = event.target.closest('[data-id]');
            if (!target) return;
            const sortable = target.dataset.sortable;
            if (sortable === "false") return;
            this.sortByHeaderClick(target);
        });

        document.addEventListener('scroll', this.onScroll );
    }

    onScroll = async event => {
        const { bottom } = this.element.getBoundingClientRect();
        const doceumentHeight = document.documentElement.clientHeight;
        if (bottom < doceumentHeight && !this.isLoading) {
            this.start = this.end;
            this.end = this.start + this.step;
      
            this.isLoading = true;
            await this.loadData();
            this.isLoading = false;
          }
    }

    initDefaultSort() {
        const element = this.subElements.header.querySelector('[data-sortable="true"]');
        element.appendChild(this.arrow);
        this.currentHeaderColumn = element;
    }

    async sortByHeaderClick(target) {
        if (this.currentHeaderColumn === target) {
            if (target.dataset.order === 'asc') {
                target.dataset.order = 'desc';
            } else {
                target.dataset.order = 'asc';
            }
        } else {
            this.currentHeaderColumn = target;
            target.appendChild(this.arrow);
        }
        if (this.sortOnClient) {
            this.sort(target.dataset.id, target.dataset.order);
        } else {
            await this.sortOnServer(this.currentHeaderColumn.dataset.id, this.currentHeaderColumn.dataset.order);
        }
    }

    initArrow() {
        const arrowTemplate = `
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        `;
        const div = document.createElement('div');
        div.innerHTML = arrowTemplate;
        this.arrow  = div.firstElementChild;
    }

    getTemplate() {
        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.renderHeader()}
                    ${this.renderDataBody()}
                </div>
            </div>
        `
    }

    renderHeader() {
        const headerItems = [];

        for (const item of this.header) {
            headerItems.push( `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
                    <span>${item.title}</span>
                </div>
            `);
        }

        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${headerItems.join('')}
            </div>
        `
    }

    renderData(data = []) {
        return data.map(item => {
            const cols = this.header.map(({id, template}) => {
                if (template === undefined) {
                    return `<div class="sortable-table__cell">${item[id]}</div>`;      
                } else {
                    return template(item[id]);
                }
            });
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${cols.join('')}
                </a>
            `
        });
    }

    renderDataBody() {
        return `
            <div data-element="body" class="sortable-table__body">
            </div>
        `
    }

    initSubElements() {
        const elements = this.element.querySelectorAll('[data-element]');

        for (const item of elements) {
            this.subElements[item.dataset.element] = item;
        }
    }

    sort(fieldValue, orderValue) {
        const sortedData = [...this.data];
        const sortType = this.header.find((item) => {
            return item.id === fieldValue;
        }).sortType;
        const sortMethod = this.sortMethod[sortType];
        const direction = this.order[orderValue];

        sortedData.sort((a, b) => {
            return sortMethod(a[fieldValue], b[fieldValue]) * direction;
        });
        
        this.subElements.body.innerHTML = this.renderData(sortedData).join('');
    }

    sortByString(a, b) {
        return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    }

    sortByNumber(a, b) {
        return a - b;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        document.removeEventListener('scroll', this.onScroll);
        this.remove();
        this.subElements = {};
    }
}
