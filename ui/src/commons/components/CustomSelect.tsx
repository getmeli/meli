import React, { useEffect, useState } from 'react';
import Select, { components as compos, createFilter } from 'react-select';
import './CustomSelect.module.scss';

export function SingleValue(props) {
  return <compos.SingleValue {...props} />;
}

export function CustomSelectOption({
  innerProps, isFocused, ...otherProps
}: any) {
  const {
    onMouseMove, onMouseOver, ...otherInnerProps
  } = innerProps;
  const newProps = {
    innerProps: {
      ...otherInnerProps,
    },
    ...otherProps,
  };
  return (
    <compos.Option {...newProps} className={`react-select-custom-option${isFocused ? ' is-focused' : ''}`} />
  );
}

const DropdownIndicator = props => (
  <compos.DropdownIndicator {...props}>
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L10 10L18 2" stroke="#A69FC6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </compos.DropdownIndicator>
);

const ClearIndicator = props => (
  <compos.ClearIndicator {...props}>
    clear
  </compos.ClearIndicator>
);

export interface Option<T> {
  label: string;
  value: T;
}

// https://react-select.com/components#replacing-components
// https://github.com/JedWatson/react-select/issues/3128#issuecomment-521242192
export function CustomSelect<T>({
  className, components, value, onChange, options, ...props
}: {
  options: Option<T>[];
  value?: T;
  onChange?: (val: T, option: Option<T>) => void;
  className?: string;
  components?: any;
  [key: string]: any;
}) {
  const [valueProxy, setValueProxy] = useState<Option<T>>();

  useEffect(() => {
    const val = options?.find(o => o.value === value);
    setValueProxy(val);
  }, [value, setValueProxy, options]);

  const onChangeProxy = (val?: any) => {
    onChange(val?.value, val);
  };

  return (
    <Select
      {...props}
      options={options}
      value={valueProxy}
      onChange={onChangeProxy}
      className={`custom-react-select${className ? ` ${className}` : ''}`}
      classNamePrefix="react-select"
      components={{
        DropdownIndicator,
        ClearIndicator,
        Option: CustomSelectOption,
        ...components,
      }}
      filterOption={createFilter({
        ignoreAccents: false,
      })}
      inputProps={{
        autoComplete: 'off',
      }}
    />
  );
}
