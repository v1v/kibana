/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Client } from '@elastic/elasticsearch';
import { ApmSynthtraceEsClient } from '../../lib/apm/client/apm_synthtrace_es_client';
import { Logger } from '../../lib/utils/create_logger';
import { RunOptions } from './parse_run_cli_flags';

export function getEsClient({
  target,
  logger,
  version,
  concurrency,
  apikey,
}: Pick<RunOptions, 'concurrency'> & {
  version: string;
  target: string;
  apikey: string;
  logger: Logger;
}) {
  var client;

  if (apikey) {
    client = new Client({
      node: target,
      auth: {
        apiKey: apikey
      }
    });
  } else {
    client = new Client({
      node: target,
    });
  }

  const apmEsClient = new ApmSynthtraceEsClient({
    client,
    logger,
    version,
    concurrency,
  });

  return apmEsClient;
}
