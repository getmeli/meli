export function getMattermostMessage(text: string) {
  return {
    username: 'meli',
    icon_url: 'https://raw.githubusercontent.com/gomeli/meli-brand/master/logo/meli-logo.svg',
    text,
    channel: undefined,
  };
}
