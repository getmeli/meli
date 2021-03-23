import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { uniqueId } from 'lodash';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';
import { useShortcut } from '../../../commons/keyboard/use-shortcut';
import { SEARCH_SHORTCUT_KEY } from '../../../commons/keyboard/shortcuts-keys';
import { SearchModal } from './SearchModal';
import { KeyboardShortcut } from '../../../commons/components/KeyboardShortcut';
import { isMac, isWindows } from '../../../commons/utils/os';
import { ButtonIcon } from '../../../commons/components/ButtonIcon';

export function Search({ className }: { className? }) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useShortcut(SEARCH_SHORTCUT_KEY, () => setIsOpen(true));

  const shortCut = isMac() ? '⌘' : isWindows() ? 'Ctrl' : undefined;

  return (
    <>
      <ButtonIcon
        className={classNames(className)}
        onClick={openModal}
        {...tooltipToggle(uid)}
      >
        <FontAwesomeIcon icon={faSearch} />
      </ButtonIcon>
      <Tooltip id={uid} className="d-flex align-items-center">
        Search
        {shortCut && (
          <>
            {' '}
            -
            <KeyboardShortcut className="ml-2" icon={false}>
              {shortCut}
              {' '}
              +
              {' '}
              {SEARCH_SHORTCUT_KEY}
            </KeyboardShortcut>
          </>
        )}
      </Tooltip>
      <SearchModal
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
}
