import { expect, test } from '@jest/globals';
import * as core from '@actions/core';
import * as main from '../src/main';

// Inputs for mock @actions/core
let inputs = {} as any;

describe('main', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'debug').mockImplementation(jest.fn());

    // Mock github context
    // jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
    //   return {
    //     owner: 'some-owner',
    //     repo: 'some-repo'
    //   }
    // })
    // github.context.ref = 'refs/heads/some-ref'
    // github.context.sha = '1234567890123456789012345678901234567890'

    // Mock ./fs-helper directoryExistsSync()
    // jest
    //   .spyOn(fsHelper, 'directoryExistsSync')
    //   .mockImplementation((path: string) => path == gitHubWorkspace)

    // // GitHub workspace
    // process.env['GITHUB_WORKSPACE'] = gitHubWorkspace
  });

  beforeEach(() => {
    // Reset inputs
    inputs = {};
  });

  afterAll(() => {
    // Restore GitHub workspace
    // delete process.env['GITHUB_WORKSPACE']
    // if (originalGitHubWorkspace) {
    //   process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace
    // }

    // // Restore @actions/github context
    // github.context.ref = originalContext.ref
    // github.context.sha = originalContext.sha

    // Restore
    jest.restoreAllMocks();
  });

  it('thing', async () => {
    //await main.run();
  });
});
