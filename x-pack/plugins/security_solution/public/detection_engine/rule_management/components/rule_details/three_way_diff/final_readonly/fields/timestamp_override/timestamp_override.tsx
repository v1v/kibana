/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiDescriptionList } from '@elastic/eui';
import * as ruleDetailsI18n from '../../../../translations';
import type { TimestampOverrideObject } from '../../../../../../../../../common/api/detection_engine';
import { TimestampOverride } from '../../../../rule_about_section';

interface TimestampOverrideReadOnlyProps {
  timestampOverride?: TimestampOverrideObject;
}

export function TimestampOverrideReadOnly({ timestampOverride }: TimestampOverrideReadOnlyProps) {
  if (!timestampOverride) {
    return null;
  }

  return (
    <EuiDescriptionList
      listItems={[
        {
          title: ruleDetailsI18n.TIMESTAMP_OVERRIDE_FIELD_LABEL,
          description: <TimestampOverride timestampOverride={timestampOverride.field_name} />,
        },
      ]}
    />
  );
}
