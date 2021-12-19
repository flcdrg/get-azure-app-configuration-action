# GitHub Action - Get Azure App Configuration

[![build-test](https://github.com/flcdrg/actions-azure-app-configuration-pull/actions/workflows/test.yml/badge.svg)](https://github.com/flcdrg/actions-azure-app-configuration-pull/actions/workflows/test.yml)

A GitHub Action that allows settings to be pulled from an Azure App Configuration store.

It is intended to be analogous to the [Azure Pipelines Azure App Configuration](https://marketplace.visualstudio.com/items?itemName=AzureAppConfiguration.azure-app-configuration-task) task.

With the Get Azure App Configuration action, you can fetch key values from an [Azure App Configuration](https://docs.microsoft.com/en-us/rest/api/keyvault/about-keys--secrets-and-certificates) instance and consume in your GitHub Action workflows.

The definition of this GitHub Action is in [action.yml](https://github.com/flcdrg/actions-get-azure-app-configuration/blob/main/action.yml).

Values fetched will be set as [outputs](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/metadata-syntax-for-github-actions#outputs) of the app configuration action instance and can be consumed in the subsequent actions in the workflow using the notation: `${{ steps.<Id-of-the-AppConfiguration-Action>.outputs.<Secret-Key> }}`. In addition, secrets are also set as environment variables. By default variables are **not** automatically masked if printed to the console or to logs.

## Example

```yaml
- uses: Azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- uses: flcdrg/actions-get-azure-app-configuration@v1
  id: get-app-configuration
  with:
    resourceGroup: ${{ secrets.RESOURCE_GROUP }}
    appConfigurationName: ${{ secrets.APP_CONFIGURATION }}
    keyFilter: 'key1'

- run: echo ${{ steps.get-app-configuration.outputs.key1 }}
```

## Other notes

```powershell
az ad sp create-for-rbac --name "app-config-action" --role contributor `
                            --scopes /subscriptions/{subscription-id}/resourceGroups`{resource-group} `
                            --sdk-auth
```
