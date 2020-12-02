import { sendEmail } from '../send-email';

interface TemplateVars {
  org: string;
  url: string;
}

export function sendInvite(to: string, vars: TemplateVars): Promise<void> {
  return sendEmail(
    [to],
    `Join ${vars.org} on Meli`,
    'invite',
    vars,
  );
}
