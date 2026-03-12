import * as React from 'react';
import renderer from 'react-test-renderer';

import { MonoText } from '../StyledText';

jest.mock('../../hooks/useColorScheme', () => () => 'light');

it(`renders correctly`, () => {
  let testRenderer;

  renderer.act(() => {
    testRenderer = renderer.create(<MonoText>Snapshot test!</MonoText>);
  });

  const tree = testRenderer.toJSON();

  expect(tree).toMatchSnapshot();
});
