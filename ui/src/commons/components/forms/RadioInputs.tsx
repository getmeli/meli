import React from 'react';
import classNames from 'classnames';
import styles from './RadioInput.module.scss';

type RadioInputOption = { value: string; label: string };

export function RadioInputs({
  value,
  onChange,
  choices,
  disabled,
}: {
  value?: any;
  onChange?: (val: any) => void;
  choices: RadioInputOption[];
  disabled?: boolean;
}) {
  const onSelect = (choice: RadioInputOption) => {
    onChange(choice.value);
  };
  return (
    <div className={classNames(styles.list, {
      [styles.disabled]: disabled,
    })}
    >
      {choices.map(choice => {
        const isSelected = value === choice.value;
        return (
          <div
            key={choice.value}
            onClick={() => !disabled && onSelect(choice)}
            className={classNames(styles.input, {
              [styles.selected]: isSelected,
            })}
          >
            <div className={`${styles.bubble} mr-2`}>
              <div className={styles.dot} />
            </div>
            <div className={styles.label}>
              {choice.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
