export class Toast {
    constructor() {
        this.container = document.querySelector('body');
        // this.initContainer();
    }

    // initContainer() {
    //     // this.container.setAttribute('aria-live', 'polite');
    //     this.container.style.position = 'fixed';
    //     this.container.style.top = '20px';
    //     this.container.style.right = '20px';
    // }

    show(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // Styling
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = 1000;

        // Accessibility attributes
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        this.container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = 1;
        }, 100);

        // Remove the toast after the specified duration
        setTimeout(() => {
            toast.style.opacity = 0;
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }
}
