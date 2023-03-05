import * as core from '@actions/core';
import * as exec from '@actions/exec';

// From https://github.com/Azure/get-keyvault-secrets/blob/master/src/main.ts#L49

export async function executeAzCliCommand(
  azPath: string,
  command: string
): Promise<string> {
  let stdout = '';
  let stderr = '';
  try {
    core.debug(`"${azPath}" ${command}`);
    await exec.exec(`"${azPath}" ${command}`, [], {
      silent: true,
      listeners: {
        stdout: (data: Buffer) => {
          stdout += data.toString();
        },
        stderr: (data: Buffer) => {
          stderr += data.toString();
        }
      }
    });
  } catch (error) {
    throw new Error(stderr);
  }
  return stdout;
}
