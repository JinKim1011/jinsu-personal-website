import { mountNavigation } from './components/navigation/Navigation.js';
import { mountFooter } from './components/footer/Footer.js';

document.addEventListener('DOMContentLoaded', () => {
    mountNavigation('.nav');
    mountFooter('.footer');
})