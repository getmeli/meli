import React, { useState } from 'react';
import { AppModalProps } from './modals/AppModal';
import { CardModal } from './modals/CardModal';

function ConfirmWithInput({ match, onMatched }: { match: string; onMatched: (doesMatch: boolean) => void }) {
  const [doesMatch, setDoesMatch] = useState(false);
  const onChange = event => {
    const { value } = event.target;
    const matchesCurrentValue = value === match;
    if (matchesCurrentValue !== doesMatch) {
      onMatched(matchesCurrentValue);
    }
    setDoesMatch(matchesCurrentValue);
  };
  return (
    <>
      <label htmlFor="confirm">
        Please type
        <strong className="lighter">{match}</strong>
        :
      </label>
      <input id="confirm" type="text" onChange={onChange} className="form-control" />
    </>
  );
}

export interface ConfirmModalProps extends AppModalProps {
  confirmLabel?: string;
  onConfirmed: (confirmed: boolean) => void;
  requireInput?: string;
}

export function Confirm({
  children, requireInput, confirmLabel, setOpen, onConfirmed, ...props
}: ConfirmModalProps) {
  const [canConfirm, setCanConfirm] = useState(!requireInput);

  const closeModal = (confirmed: boolean) => {
    setOpen(false);
    // true check is important because the onClose returns an object when the backdrop is clicked
    onConfirmed(confirmed === true);
  };

  return (
    <CardModal
      setOpen={setOpen}
      closeModal={() => closeModal(false)}
      {...props}
    >
      {children}
      <div>
        <button
          type="button"
          className="btn btn-primary float-right"
          disabled={!canConfirm}
          onClick={() => closeModal(true)}
        >
          {confirmLabel || 'Confirm'}
        </button>
        {requireInput && (
          <ConfirmWithInput match={requireInput} onMatched={setCanConfirm} />
        )}
      </div>
    </CardModal>
  );
}
