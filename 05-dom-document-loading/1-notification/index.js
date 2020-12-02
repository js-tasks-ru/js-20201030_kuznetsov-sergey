export default class NotificationMessage {
    static current = null;

    constructor(title = '', {
        duration = 2000,
        type = 'success'
    } = {}) {
        this.duration = duration;
        this.type = type;
        this.title = title;

        this.render();
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = this.getTemplate();
        this.element  = div.firstElementChild;
        this.initSubElements();
    }

    getTemplate() {
        return `
            <div class="notification ${this.type}" style="--value:${this.duration}ms">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.title}
                    </div>
                </div>
            </div>
        `
    }

    initSubElements() {
        const elements = this.element.querySelectorAll('[data-element]');

        for (const item of elements) {
            this.subElements[item.dataset.element] = item;
        }
    }

    show(targetElement = document.body) {
        if (NotificationMessage.current !== null) {
            NotificationMessage.current.remove();
        }
        NotificationMessage.current = this;
        
        setTimeout(() => {
            this.destroy();
        }, this.duration);

        targetElement.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
    }
}
