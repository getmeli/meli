import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Token } from './token';
import { DeleteToken } from './DeleteToken';
import { CopyToClipboard } from '../../../commons/components/CopyToClipboard';
import { FromNow } from '../../../commons/components/FromNow';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';

export function TokenView({
  token, siteId, onDelete,
}: {
  token: Token;
  siteId: string;
  onDelete: () => void;
}) {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div className="flex-grow-1 d-flex align-items-center">
        <strong className="mr-3">{token.name}</strong>
      </div>

      <div className="d-flex align-items-center">
        <FromNow date={token.createdAt} label="Created" />
        <CopyToClipboard value={token.value} className="ml-2">
          <ButtonIcon>
            <FontAwesomeIcon icon={faCopy} />
          </ButtonIcon>
        </CopyToClipboard>
        <DeleteToken siteId={siteId} tokenId={token._id} onDelete={onDelete}>
          <ButtonIcon>
            <FontAwesomeIcon icon={faTimes} />
          </ButtonIcon>
        </DeleteToken>
      </div>
    </div>
  );
}
