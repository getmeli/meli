export function stringToInt(radix = 10) {
  return value => {
    const int = parseInt(value, radix);
    return Number.isNaN(int) ? undefined : int;
  };
}

export function stringToFloat() {
  return value => {
    const int = parseFloat(value);
    return Number.isNaN(int) ? undefined : int;
  };
}

export function stringToBoolean() {
  return value => {
    if (typeof value === 'boolean') {
      return value;
    }
    if (value === null || value === undefined || value === '') {
      return value;
    }
    return value === 'true' || value === '1';
  };
}

export function commaSeparatedStringToArray() {
  return value => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return undefined;
  };
}

export function stringToJson(onError: (err: any) => void) {
  return value => {
    if (typeof value !== 'string' || value === '') {
      return undefined;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      onError(e);
    }
  };
}
