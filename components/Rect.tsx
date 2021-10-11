import React from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import { Shape, Group, Path } from '@react-native-community/art';

type Props = {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  x?: number;
  y?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomRightRadius?: number;
  bottomLeftRadius?: number;
  borderRadius?: number;
};

const Rect = ({
  fill,
  stroke,
  x,
  y,
  borderRadius,
  width,
  height,
  topLeftRadius,
  topRightRadius,
  bottomRightRadius,
  bottomLeftRadius,
  ...rest
}: Props) => {
  const startX = 0;
  const startY = 0;
  const smallDimension = width > height ? height : width;
  let tlr = topLeftRadius !== null ? topLeftRadius : borderRadius;
  tlr = tlr > smallDimension / 2 ? smallDimension / 2 : tlr;
  let trr = topRightRadius !== null ? topRightRadius : borderRadius;
  trr = trr > smallDimension / 2 ? smallDimension / 2 : trr;
  let brr = bottomRightRadius !== null ? bottomRightRadius : borderRadius;
  brr = brr > smallDimension / 2 ? smallDimension / 2 : brr;
  let blr = bottomLeftRadius !== null ? bottomLeftRadius : borderRadius;
  blr = blr > smallDimension / 2 ? smallDimension / 2 : blr;
  const d = Path()
    .move(startX, startY)
    .move(startX, tlr)
    .arc(tlr, startY - tlr, tlr, tlr, false, false) // top left
    .lineTo(width - trr, startY)
    .arc(trr, startX + trr, trr, trr, false, false) // top right
    .lineTo(width, startY + (height - brr))
    .arc(startX - brr, brr, brr, brr, false, false) // bottom right
    .lineTo(startX + blr, height)
    .arc(startX - blr, startY - blr, blr, blr, false, false) // bottom right
    .close();

  return (
    <Group x={x} y={y}>
      <Shape {...rest} fill={fill} stroke={stroke} d={d} />
    </Group>
  );
};

Rect.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  topLeftRadius: PropTypes.number,
  topRightRadius: PropTypes.number,
  bottomRightRadius: PropTypes.number,
  bottomLeftRadius: PropTypes.number,
  borderRadius: PropTypes.number,
};

Rect.defaultProps = {
  rc: 20,
  x: 0,
  y: 0,
  fill: 'transparent',
  stroke: 'red',
  topLeftRadius: null,
  topRightRadius: null,
  bottomRightRadius: null,
  bottomLeftRadius: null,
};

export default Rect;
