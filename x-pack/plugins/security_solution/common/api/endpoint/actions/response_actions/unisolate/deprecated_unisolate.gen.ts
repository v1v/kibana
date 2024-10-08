/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Endpoint Unisolate Schema
 *   version: 2023-10-31
 */

import type { z } from '@kbn/zod';

import { BaseActionSchema, SuccessResponse } from '../../../model/schema/common.gen';

export type EndpointUnisolateRedirectRequestBody = z.infer<
  typeof EndpointUnisolateRedirectRequestBody
>;
export const EndpointUnisolateRedirectRequestBody = BaseActionSchema;
export type EndpointUnisolateRedirectRequestBodyInput = z.input<
  typeof EndpointUnisolateRedirectRequestBody
>;

export type EndpointUnisolateRedirectResponse = z.infer<typeof EndpointUnisolateRedirectResponse>;
export const EndpointUnisolateRedirectResponse = SuccessResponse;
