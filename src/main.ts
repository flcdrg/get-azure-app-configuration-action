import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import { AppConfigurationClient } from '@azure/app-configuration';

export async function run(): Promise<void> {
  try {
    const resourceGroup: string = core.getInput('resourceGroup', {
      required: true
    });
    const appConfigurationName: string = core.getInput('appConfigurationName', {
      required: true
    });
    const keyFilter: string = core.getInput('keyFilter');

    const azPath = await io.which('az', true);
    const connectionString = await executeAzCliCommand(
      azPath,
      `appconfig credential list -g ${resourceGroup} -n ${appConfigurationName} --query "([?name=='Primary Read Only'].connectionString)[0]"`
    );

    core.setSecret(connectionString);

    const client = new AppConfigurationClient(connectionString);

    const response = await client.getConfigurationSetting({ key: keyFilter });

    if (response.statusCode < 400) {
      core.exportVariable(response.key, response.value);
      core.setOutput(response.key, response.value);
    } else {
      core.setFailed(
        `Could not get value for key '${keyFilter}', error status ${response.statusCode}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

// From https://github.com/Azure/get-keyvault-secrets/blob/master/src/main.ts#L49
async function executeAzCliCommand(
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
