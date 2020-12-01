export default class SortableTable {
    element;
    subElements = {};
    
    constructor(
        header = [],
        {data = []} = {} 
    ) {
        this.header = header;
        this.data = data;
        this.render();
        this.initEventListeners();
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate();
        this.element  = div.firstElementChild;
        this.initArrow();
        this.initSubElements();
        this.defaultSort();
    }

    initEventListeners() {
        this.subElements.header.addEventListener('pointerdown', event => {
            const target = event.target.closest('[data-id]');
            if (!target) return;

            const sortable = target.dataset.sortable;
            if (sortable === "false") return;

            this.sortByHeaderClick(target);
        });
    }

    defaultSort() {
        const element = this.subElements.header.querySelector('[data-sortable="true"]');
        element.appendChild(this.arrow);
        this.currentHeaderColumn = element;
        this.sortByHeaderClick(element);
    }

    sortByHeaderClick(target) {
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

        this.sort(target.dataset.id, target.dataset.order);
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
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="desc">
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

    renderData(data) {
        const dataItems = [];
        for (const item of  data) {
            const cols = [];
            this.header.forEach(({id, template}) => {
                if (template === undefined) {
                    const temp = `<div class="sortable-table__cell">${item[id]}</div>`;
                    cols.push(temp);
                } else {
                    const temp = template(item[id]);
                    cols.push(temp);
                }
            });
            const rowTemp = `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${cols.join('')}
                </a>
            `
            dataItems.push(rowTemp);
        }

        return dataItems;
    }

    renderDataBody() {
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.renderData(this.data).join('')}
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
        let order;
        switch(orderValue) {
            case 'asc': 
                order = 1;
                break;
            case 'desc': 
                order = -1;
                break;
        }

        const sortType = this.header.find((item) => {
            return item.id === fieldValue;
        }).sortType;

        let callback = () => {};
        switch(sortType) {
            case 'string': 
                callback = (a, b) => {
                    return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
                };
                break;
            case 'number': 
                callback = (a, b) => {
                    return a - b;
                };
                break;
        }

        sortedData.sort((a, b) => {
            return callback(a[fieldValue], b[fieldValue]) * order;
        });

        this.subElements.body.innerHTML = this.renderData(sortedData).join('');
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
    }
}

