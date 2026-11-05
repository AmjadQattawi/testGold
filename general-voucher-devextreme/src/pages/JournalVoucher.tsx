import Button from 'devextreme-react/button';
import { useJournalVoucher } from '../hooks/useJournalVoucher';
import VoucherInfo from '../components/voucher/VoucherInfo';
import VoucherDetails from '../components/voucher/VoucherDetails';
import VoucherDraftSearch from '../components/voucher/VoucherDraftSearch';
import VoucherToolbar from '../components/voucher/VoucherToolbar';
export default function JournalVoucher() {
    const controller = useJournalVoucher();
    if (controller.exited)
        return <main className="exit-screen"><h1>Journal entries</h1><Button text="Journal voucher" type="default" onClick={() => controller.setExited(false)}/></main>;
    return <main dir="ltr"><VoucherInfo controller={controller}/><VoucherDetails controller={controller}/><VoucherDraftSearch controller={controller}/><VoucherToolbar controller={controller}/></main>;
}
