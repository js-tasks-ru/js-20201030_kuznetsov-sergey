export default class DoubleSlider {
    element;
    sliderLeftX;
    sliderRightX;
    currentSelectedName;
    subElements = {};

    constructor({
        min = 0,
        max = 100,
        formatValue = value => value,
        selected = {
            from: min,
            to: max
        }
    } = {}) {
        this.min = min;
        this.max = max;
        this.formatValue = formatValue;
        this.selected = selected
        this.rangeCoef = (max - min) / 100;
        this.render();
        this.updateDOM();
        this.initEventListeners();
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate();
        this.element  = div.firstElementChild;
        this.initSubElements();
    }

    getTemplate() {
        return `
            <div class="range-slider">
                <span data-element="from"></span>
                <div data-element="slider" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress"></span>
                    <span data-element="left"     class="range-slider__thumb-left"></span>
                    <span data-element="right"    class="range-slider__thumb-right"></span>
                </div>
                <span data-element="to"></span>
            </div>
        `
    }

    updateDOM() {
        const {from, to, progress, left, right} = this.subElements;
        const leftValue      = (this.selected.from - this.min) / this.rangeCoef;
        const rightValue     = (this.max - this.selected.to) / this.rangeCoef;

        from.innerHTML       = this.formatValue(parseInt(this.selected.from));
        to.innerHTML         = this.formatValue(parseInt(this.selected.to));
        progress.style.left  = `${leftValue}%`;
        progress.style.right = `${rightValue}%`;
        left.style.left      = `${leftValue}%`;
        right.style.right    = `${rightValue}%`;
    }

    initEventListeners() {
        this.subElements.slider.addEventListener('pointerdown', event => {
            switch (event.target) {
                case this.subElements.left:
                case this.subElements.right:
                    this.initEventMove(event);
                    break;
                default:
                    return;
            } 
        });
    }

    initEventMove(event) {
        const name = {
            'left': 'from',
            'right': 'to'
        }

        const {left, width}  = this.subElements.slider.getBoundingClientRect();
        this.sliderLeftX  = left;
        this.sliderRightX = left + width;
        this.currentSelectedName = name[event.target.dataset.element];

        document.addEventListener('pointerup', this.onMouseUp);
        document.addEventListener('pointermove', this.onMouseMove);
    }

    onMouseUp = event => {
        document.removeEventListener('pointerup',   this.onMouseUp);
        document.removeEventListener('pointermove', this.onMouseMove);

        const detail = {
            'from': this.selected.from,
            'to': this.selected.to
        }

        this.element.dispatchEvent(new CustomEvent('range-select', {
            detail: detail,
            bubbles: true
        }));
    }

    onMouseMove = event => {
        const koef  = (event.clientX - this.sliderLeftX) / (this.sliderRightX - this.sliderLeftX);
        let value = this.min + (this.max - this.min) * koef;
        if (value > this.max) {
            value = this.max;
        }
        if (value < this.min) {
            value = this.min;
        }
        switch(this.currentSelectedName) {
            case 'from':
                if (value > this.selected['to']) {
                    value = this.selected['to'];
                }
                break;
            case 'to':
                if (value < this.selected['from']) {
                    value = this.selected['from'];  
                }
                break;
        }
        this.selected[this.currentSelectedName] = value;
        this.updateDOM();
    }

    initSubElements() {
        const elements = this.element.querySelectorAll('[data-element]');
        for (const item of elements) {
            this.subElements[item.dataset.element] = item;
        }
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        document.removeEventListener('pointerup',   this.onMouseUp);
        document.removeEventListener('pointermove', this.onMouseMove);
        this.remove();
    }
}
