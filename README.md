# GitHub Action - Get Azure App Configuration

[![build-test](https://github.com/flcdrg/get-azure-app-configuration-action/actions/workflows/test.yml/badge.svg)](https://github.com/flcdrg/get-azure-app-configuration-action/actions/workflows/test.yml)

A GitHub Action that allows settings to be pulled from an Azure App Configuration store.

It is intended to be analogous to the [Azure Pipelines Azure App Configuration](https://marketplace.visualstudio.com/items?itemName=AzureAppConfiguration.azure-app-configuration-task) task.

With the Get Azure App Configuration action, you can fetch key values from an [Azure App Configuration](https://azure.microsoft.com/services/app-configuration/?WT.mc_id=AZ-MVP-5001655) instance and consume them in your GitHub Action workflows.

The definition of this GitHub Action is in [action.yml](https://github.com/flcdrg/get-azure-app-configuration-action/blob/main/action.yml).

Values fetched will be set as [outputs](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/metadata-syntax-for-github-actions#outputs) of the app configuration action instance and can be consumed in the subsequent actions in the workflow using the notation: `${{ steps.<Id-of-the-AppConfiguration-Action>.outputs.<Secret-Key> }}`. In addition, secrets are also set as environment variables. By default, variables are **not** automatically masked if printed to the console or logs.

## Example

```yaml
- uses: Azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- uses: flcdrg/get-azure-app-configuration-action@v2
  id: get-app-configuration
  with:
    resourceGroup: ${{ secrets.RESOURCE_GROUP }}
    appConfigurationName: ${{ secrets.APP_CONFIGURATION }}
    keyFilter: 'key1'

- run: echo ${{ steps.get-app-configuration.outputs.key1 }}
```

## Inputs

Various inputs are defined in [`action.yml`](action.yml) to let you configure this action:

| Name | Description |
| - | - |
| `resourceGroup` | The name of the resource group that contains the App Configuration resource |
| `appConfigurationName` | The name of the App Configuration resource |
| `keyFilter` | See below |
| `labelFilter` | See below |

### keyFilter

Filters for keys. There are two types of matching:

1. Exact matching. Up to 5 key names are allowed, separated by commas (',')
2. Wildcard matching. A single wildcard expression can be specified.

| Value          | Matches                               |
|----------------|---------------------------------------|
| omitted or `*` | Matches any key                       |
| `abc`          | Matches a key named abc               |
| `abc*`         | Matches key names that start with abc |

These characters are reserved and must be prefixed with a backslash to be specified: `*` or `\` or `,`

### labelFilter

Filters for labels. There are two types of matching:

1. Exact matching. Up to 5 labels are allowed, separated by commas (',')
2. Wildcard matching. A single wildcard expression can be specified.

| Value          | Matches                                           |
|----------------|---------------------------------------------------|
| omitted or `*` | Matches any key                                   |
| `%00`          | Matches any key without a label                   |
| `prod`         | Matches a key with label named prod               |
| `prod*`        | Matches key with label names that start with prod |

These characters are reserved and must be prefixed with a backslash in order
to be specified: `*` or `\` or `,`

## Using Azure Key Vault

Azure App Configuration can reference Key Vault secrets. In order for this to work with your GitHub Action, you need to ensure the following:

- The Azure Key Vault needs to be accessible from the GitHub Action agent. For GitHub-hosted agents, this means you'll need to [allow public access from all networks](https://learn.microsoft.com/azure/key-vault/general/network-security?WT.mc_id=DOP-MVP-5001655).
- The service principal used to log in to Azure will require the ability to read secrets. Either via an [access policy](https://learn.microsoft.com/azure/key-vault/general/assign-access-policy?WT.mc_id=DOP-MVP-5001655) or if using [RBAC then the Key Vault Secrets User](https://learn.microsoft.com/azure/key-vault/general/rbac-guide?WT.mc_id=DOP-MVP-5001655) role.

## Other notes

Create a new service principal with contributor access to a resource group.

```powershell
az ad sp create-for-rbac --name "app-config-action" --role contributor `
                            --scopes /subscriptions/{subscription-id}/resourceGroups/`{resource-group} `
                            --sdk-auth
```

Find existing service principal

```powershell
az ad sp list --query "[?displayName == 'app-config-action']"
```

Renew service principal secret

```powershell
az ad sp credential reset --id 4715aece-8daf-4a1a-8f0e-e5eddc9bf8de --display-name rbac --years 1
```
