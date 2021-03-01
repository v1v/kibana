/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { resolve } from 'path';

import { FtrConfigProviderContext } from '@kbn/test/types/ftr';

import { CA_CERT_PATH } from '@kbn/dev-utils';
async function config({ readConfigFile }: FtrConfigProviderContext) {
  const kibanaCommonTestsConfig = await readConfigFile(
    require.resolve('../../../../test/common/config.js')
  );
  const xpackFunctionalTestsConfig = await readConfigFile(
    require.resolve('../../../test/functional/config.js')
  );

  return {
    ...kibanaCommonTestsConfig.getAll(),

    esArchiver: {
      directory: resolve(__dirname, 'elastic_synthetics/fixtures/es_archiver'),
    },

    esTestCluster: {
      skipEsCluster: true,
      ...xpackFunctionalTestsConfig.get('esTestCluster'),
      serverArgs: [
        ...xpackFunctionalTestsConfig.get('esTestCluster.serverArgs'),
        // define custom es server here
        // API Keys is enabled at the top level
        'xpack.security.enabled=true',
      ],
    },

    kbnTestServer: {
      ...xpackFunctionalTestsConfig.get('kbnTestServer'),
      serverArgs: [
        ...xpackFunctionalTestsConfig.get('kbnTestServer.serverArgs'),
        '--csp.strict=false',
        // define custom kibana server args here
        `--elasticsearch.ssl.certificateAuthorities=${CA_CERT_PATH}`,
        `--elasticsearch.ignoreVersionMismatch=true`,
        `--uiSettings.overrides.theme:darkMode=true`,
        `--elasticsearch.username=kibana_system`,
        `--elasticsearch.password=changeme`,
      ],
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default config;
