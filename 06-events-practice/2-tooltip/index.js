class Tooltip {
    element = null;

    initialize() {
        document.addEventListener('pointerover', this.onmouseover);
        document.addEventListener('pointerout',  this.onmouseout);
    }

    onmouseover = event => {
        const target = event.target.closest('[data-tooltip]');
        if (!target) return;

        if (target.dataset.tooltip !== undefined) {
            this.render(target.dataset.tooltip);
            document.addEventListener('mousemove',  this.onmousemove);
        }
    }

    onmouseout = event => {
        this.remove();
    }

    onmousemove = event => {
        this.element.style.top  = (event.clientY + 10) + 'px';
        this.element.style.left = (event.clientX + 10) + 'px';
    }

    getTemplate(title) {
        return `<div class="tooltip">${title}</div>`;
    }

    render(title = '') {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate(title);
        this.element  = div.firstElementChild;
        document.body.appendChild(this.element);
    }

    destroy() {
        document.removeEventListener('pointerover', this.onmouseover);
        document.removeEventListener('mousemove',   this.onmousemove);
        document.removeEventListener('pointerout',  this.onmouseout);
        this.remove();
    }

    remove() {
        if (this.element !== null) {
            this.element.remove();
        }
    }
}

const tooltip = new Tooltip();

export default tooltip;
