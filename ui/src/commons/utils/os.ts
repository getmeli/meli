export function isMac(): boolean {
  const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
  const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
  return isMacLike || isIOS;
}

export function isWindows(): boolean {
  return /Win/i.test(navigator.platform);
}
