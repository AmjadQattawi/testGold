import { createRoot } from 'react-dom/client';
import { locale } from 'devextreme/localization';

import JournalVoucher from './pages/JournalVoucher';
import 'devextreme/dist/css/dx.light.css';
import './styles.css';

locale('en');
createRoot(document.getElementById('root')!).render(<JournalVoucher />);
