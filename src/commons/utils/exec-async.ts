import { exec, ExecOptions } from 'child_process';

export class ExecError extends Error {
  constructor(
    private readonly error: any,
    private readonly stdout: string,
    private readonly stderr: string,
  ) {
    super();
  }
}

export function execAsync(cmd: string, options?: ExecOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        reject(new ExecError(error, stdout, stderr));
      }
      resolve(stdout);
    });
  });
}
