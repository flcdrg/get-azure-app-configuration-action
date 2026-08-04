import { PagedAsyncIterableIterator } from '@azure/core-paging';
import * as core from '@actions/core';
import * as io from '@actions/io';
import {
  AppConfigurationClient,
  ConfigurationSetting,
  ListConfigurationSettingPage,
  ListConfigurationSettingsOptions,
  PageSettings
} from '@azure/app-configuration';
import { executeAzCliCommand } from './executeAzCliCommand.js';
import { DefaultAzureCredential } from '@azure/identity';

export type AppConfigurationAuthMode = 'managedIdentity' | 'connectionString';

function getAppConfigurationEndpoint(appConfigurationName: string): string {
  return `https://${appConfigurationName}.azconfig.io`;
}

async function getConnectionString(
  resourceGroup: string | undefined,
  appConfigurationName: string
): Promise<string> {
  if (!resourceGroup) {
    throw new Error(
      'resourceGroup is required when authMode is connectionString'
    );
  }

  const azPath = await io.which('az', true);
  const connectionString = await executeAzCliCommand(
    azPath,
    `appconfig credential list -g ${resourceGroup} -n ${appConfigurationName} --query "([?name=='Primary Read Only'].connectionString)[0]"`
  );

  core.setSecret(connectionString);

  return connectionString;
}

export async function getKeys(
  resourceGroup: string | undefined,
  appConfigurationName: string,
  filter: ListConfigurationSettingsOptions,
  authMode: AppConfigurationAuthMode = 'managedIdentity'
): Promise<
  PagedAsyncIterableIterator<
    ConfigurationSetting<string>,
    ListConfigurationSettingPage,
    PageSettings
  >
> {
  const client =
    authMode === 'connectionString'
      ? new AppConfigurationClient(
          await getConnectionString(resourceGroup, appConfigurationName)
        )
      : new AppConfigurationClient(
          getAppConfigurationEndpoint(appConfigurationName),
          new DefaultAzureCredential()
        );

  return client.listConfigurationSettings(filter);
}
