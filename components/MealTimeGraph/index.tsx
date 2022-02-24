import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';
import { Group, Surface } from '@react-native-community/art';
import { BarGraphData } from './types';
import D3Rectangle from './components/D3Rectangle';


type Props = {
  data: BarGraphData[];
  width: number;
  height: number;
  thickness: number;
};

const MealTimeGraph = ({ data }: Props) => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  let barsWidth = width - 10;
  let barsHeight = height / 3;

  return (
    <View style={styles.main}>
      <Surface width={width} height={height}>
        <D3Rectangle startingXPos={0} startingYPos={0} height={3} length={300} color="black" />

        {data.map((item: BarGraphData, index: number) => {
          return (
            <Group key={index} x={width * 0.1} y={25}>
              {/* <HorizontalBarContainer label="hi" /> */}


              <Group key={index} x={width * 0.1} y={0}>
                {/* <Text
                // @ts-ignore
                font={{
                  fontFamily: 'Helvetica, Neue Helvetica, Arial',
                  fontSize: 20,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}
                fill="#acacac"
                alignment="left"
                x={-40}
                y={20 + (height / data.length) * index}
              >
                {height}
              </Text> */}
                <Text
                  // @ts-ignore
                  font={{
                    fontFamily: 'Helvetica, Neue Helvetica, Arial',
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                  }}
                  fill="#939393"
                  alignment="left"
                  x={-40}
                  y={40 + (height / data.length) * index}
                >
                  {item.label}
                </Text>
              </Group>
            </Group>
          );
        })}
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingVertical: 25,
    marginHorizontal: 0,
  },
});

export default MealTimeGraph;