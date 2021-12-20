/* eslint-disable import/named */
/**
 * Integration Tests
 *
 * These tests require access to an Azure Subscription which has an App Configuration RESOURCE
 * within a RESOURCE_GROUP. The values for these default to those used in the Azure Subscription
 * used when testing in the GitHub Action(s).
 *
 * The contents of the App Configuration resource should mirror the values stored in the
 * appconfig-sample*.json files (included in this directory)
 *
 * @group integration
 */
import {
  ConfigurationSetting,
  ListConfigurationSettingPage,
  PageSettings
} from '@azure/app-configuration';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import * as getKeys from '../src/appConfiguration';

type StringDictionary = {
  [id: string]: string;
};

describe('appConfiguration', () => {
  const resourceGroup =
    process.env.RESOURCE_GROUP ?? 'rg-appconfig-test-australiaeast';
  const resource = process.env.RESOURCE ?? 'appcs-appconfig-test-australiaeast';

  it('all', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      keyFilter: '',
      labelFilter: ''
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('single key1', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      keyFilter: 'key1'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('wildcard key*', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      keyFilter: 'key*'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('multiple key1,key2', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      keyFilter: 'key1,key2'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('single label2', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      labelFilter: 'label2'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('wildcard label*', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      labelFilter: 'label*'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });

  it('key3 and label3', async () => {
    const keys = await getKeys.getKeys(resourceGroup, resource, {
      keyFilter: 'key3',
      labelFilter: 'label3'
    });

    const result: StringDictionary = {};

    await copyToResult(keys, result);

    expect(result).toMatchSnapshot();
  });
});

async function copyToResult(
  keys: PagedAsyncIterableIterator<
    ConfigurationSetting<string>,
    ListConfigurationSettingPage,
    PageSettings
  >,
  result: StringDictionary
): Promise<void> {
  for await (const setting of keys) {
    if (setting.value) {
      result[setting.key] = setting.value;
    }
  }
}
