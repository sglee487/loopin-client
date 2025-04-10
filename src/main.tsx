import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@presentation/styles/index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
