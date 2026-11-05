import DateBox from 'devextreme-react/date-box';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import ValidationGroup from 'devextreme-react/validation-group';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import type { VoucherController } from '../../hooks/useJournalVoucher';
import VoucherIcon from './VoucherIcon';

export default function VoucherInfo({ controller }: { controller: VoucherController }) {
  const { voucher, setVoucher, saved, index, blocked, open, form } = controller;
  return (
    <section className="voucher-info card">
      <header className="section-heading info-heading">
        <div className="heading-title">
          <h2><VoucherIcon name="document" />Voucher information</h2>
          <span className="status"><VoucherIcon name={voucher.archived ? 'archive' : 'unposted'} />{voucher.archived ? 'Archived' : 'Unposted'}</span>
        </div>
        <h1>Journal voucher</h1>
        <div className="info-aside">
          <span>Required fields are marked *</span>
          <div className="navigation" aria-label="Draft navigation">
            <Button text="«" hint="First draft" disabled={!saved.length || index === 0 || !!blocked} onClick={() => open(saved[0])} />
            <Button text="‹" hint="Previous draft" disabled={index <= 0 || !!blocked} onClick={() => open(saved[index - 1])} />
            <span>{index + 1} / {saved.length}</span>
            <Button text="›" hint="Next draft" disabled={!saved.length || index === saved.length - 1 || !!blocked} onClick={() => open(saved[index + 1])} />
            <Button text="»" hint="Last draft" disabled={!saved.length || index === saved.length - 1 || !!blocked} onClick={() => open(saved.at(-1)!)} />
          </div>
        </div>
      </header>
      <ValidationGroup ref={form}>
        <div className="voucher-fields">
          <div className="field-grid">
            <div className="voucher-field">
              <label htmlFor="voucher-date"><VoucherIcon name="calendar" />Voucher date *</label>
              <DateBox value={voucher.date || null} inputAttr={{ id: 'voucher-date', 'aria-label': 'Voucher date' }}
                type="date" dateSerializationFormat="yyyy-MM-dd" displayFormat="MM/dd/yyyy" useMaskBehavior
                onValueChanged={e => { if (e.event) setVoucher(v => ({ ...v, date: e.value ?? '' })); }}>
                <Validator><RequiredRule message="Voucher date is required" /></Validator>
              </DateBox>
            </div>
            <div className="voucher-field">
              <label htmlFor="voucher-number"><VoucherIcon name="hash" />Voucher number</label>
              <TextBox value={voucher.number} inputAttr={{ id: 'voucher-number', 'aria-label': 'Voucher number' }} onValueChanged={e => setVoucher(v => ({ ...v, number: e.value ?? '' }))} />
            </div>
            <div className="voucher-field">
              <label htmlFor="voucher-automatic"><VoucherIcon name="hash" />Automatic number</label>
              <TextBox value={voucher.automaticNo} readOnly placeholder="—" inputAttr={{ id: 'voucher-automatic', 'aria-label': 'Automatic number' }} />
            </div>
            <div className="voucher-field">
              <label htmlFor="voucher-confidentiality"><VoucherIcon name="shield" />Confidentiality</label>
              <SelectBox value={voucher.confidentiality} items={['Normal', 'Confidential']} inputAttr={{ id: 'voucher-confidentiality', 'aria-label': 'Confidentiality' }} onValueChanged={e => { if (e.event) setVoucher(v => ({ ...v, confidentiality: e.value })); }} />
            </div>
          </div>
          <div className="voucher-field notes-field">
            <label htmlFor="voucher-notes"><VoucherIcon name="document" />Notes</label>
            <TextArea value={voucher.notes} height={56} inputAttr={{ id: 'voucher-notes', 'aria-label': 'Notes' }} onValueChanged={e => setVoucher(v => ({ ...v, notes: e.value ?? '' }))} />
          </div>
        </div>
      </ValidationGroup>
    </section>
  );
}
