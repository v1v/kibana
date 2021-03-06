/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mount, shallow } from 'enzyme';
import React from 'react';

import { TestProviders } from '../../../../common/mock/test_providers';

import { mockDataProviders } from './mock/mock_data_providers';
import { Provider } from './provider';

describe('Provider', () => {
  describe('rendering', () => {
    test('renders correctly against snapshot', () => {
      const wrapper = shallow(<Provider dataProvider={mockDataProviders[0]} />);
      expect(wrapper).toMatchSnapshot();
    });

    test('it renders the data provider', () => {
      const wrapper = mount(
        <TestProviders>
          <Provider dataProvider={mockDataProviders[0]} />
        </TestProviders>
      );

      expect(wrapper.text()).toContain('name: "Provider 1"');
    });
  });
});
