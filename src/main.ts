import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { getKeys } from './appConfiguration';

export async function run(): Promise<void> {
  try {
    const resourceGroup = core.getInput('resourceGroup', {
      required: true
    });
    const appConfigurationName = core.getInput('appConfigurationName', {
      required: true
    });

    const keyFilter = core.getInput('keyFilter');
    const labelFilter = core.getInput('labelFilter');

    const keys = await getKeys(resourceGroup, appConfigurationName, {
      keyFilter,
      labelFilter
    });

    for await (const setting of keys) {
      core.setOutput(setting.key, setting.value);
      core.exportVariable(setting.key, setting.value);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

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
      silent: true, // this will prevent printing access token to console output
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

run();
