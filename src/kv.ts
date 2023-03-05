import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
import * as core from '@actions/core';

export async function getKeyVaultSecret(
  vaultUrl: string,
  secretName: string
): Promise<string | undefined> {
  const credentials = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, credentials);

  const secret = await client.getSecret(secretName);

  if (secret.value) {
    core.setSecret(secret.value);
  }

  return secret.value;
}
