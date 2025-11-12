import { mountNavigation } from '../components/navigation/navigation.js';
import { mountFooter } from './components/footer/footer.js';

document.addEventListener('DOMContentLoaded', () => {
    mountNavigation('.nav');
    mountFooter('.footer');
})