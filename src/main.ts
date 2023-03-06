import * as core from '@actions/core';

import { getKeys } from './appConfiguration';

import { getKeyVaultSecret } from './kv';
import {
  isSecretReference,
  parseSecretReference
} from '@azure/app-configuration';
import { parseKeyVaultSecretIdentifier } from '@azure/keyvault-secrets';

export async function run(): Promise<void> {
  try {
    const resourceGroup = core.getInput('resourceGroup', {
      required: true
    });
    const appConfigurationName = core.getInput('appConfigurationName', {
      required: true
    });

    const keyFilter = core.getInput('keyFilter');
    const labelFilter = core.getInput('labelFilter') || '\0'; // default to keys with no label

    const keys = await getKeys(resourceGroup, appConfigurationName, {
      keyFilter,
      labelFilter
    });

    for await (const setting of keys) {
      // https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/appconfiguration/app-configuration/samples-dev/secretReference.ts
      if (isSecretReference(setting)) {
        const parsedSecretReference = parseSecretReference(setting);

        const { name: secretName, vaultUrl } = parseKeyVaultSecretIdentifier(
          parsedSecretReference.value.secretId
        );

        const secretValue = await getKeyVaultSecret(vaultUrl, secretName);

        core.debug(
          `Exporting ${setting.key} from Key Vault with ${secretValue}`
        );
        core.setOutput(setting.key, secretValue);
        core.exportVariable(setting.key, secretValue);
      } else {
        const settingValue = setting.value;
        core.debug(
          `Exporting ${setting.key} from App Configuration with ${settingValue}`
        );
        core.setOutput(setting.key, settingValue);
        core.exportVariable(setting.key, setting.value);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
