/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { API_ROUTE_TEMPLATES } from '../../common/lib/constants';
import { fetch } from '../../common/lib/fetch';
import { platformService } from '../services';
import { CanvasTemplate } from '../../types';

const getApiPath = function () {
  const basePath = platformService.getService().getBasePath();
  return `${basePath}${API_ROUTE_TEMPLATES}`;
};

interface ListResponse {
  templates: CanvasTemplate[];
}

export async function list() {
  const templateResponse = await fetch.get<ListResponse>(`${getApiPath()}`);

  return templateResponse.data.templates;
}
