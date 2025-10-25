import { exec } from "child_process";

export function cmd_run(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}
