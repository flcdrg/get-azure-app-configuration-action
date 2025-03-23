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
import { executeAzCliCommand } from './executeAzCliCommand';

export async function getKeys(
  resourceGroup: string,
  appConfigurationName: string,
  filter: ListConfigurationSettingsOptions
): Promise<
  PagedAsyncIterableIterator<
    ConfigurationSetting<string>,
    ListConfigurationSettingPage,
    PageSettings
  >
> {
  const azPath = await io.which('az', true);
  const connectionString = await executeAzCliCommand(
    azPath,
    `appconfig credential list -g ${resourceGroup} -n ${appConfigurationName} --query "([?name=='Primary Read Only'].connectionString)[0]"`
  );

  core.setSecret(connectionString);

  const client = new AppConfigurationClient(connectionString);

  return client.listConfigurationSettings(filter);
}
