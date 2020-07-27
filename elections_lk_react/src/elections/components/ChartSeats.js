import React, {Component} from 'react';

import {getPartyColor} from '../utils/party.js';

const BOX_DIM = 20;
const BOXES_PER_COLUMN = 10;

export default class ChartSeats extends Component {
  render() {
    const result = this.props.result;
    let x = 0;
    let y = 0;
    let cumSeatCount = 0;

    const renderedBoxList = result['by_party'].map(
      function(forParty) {
        const partyCode = forParty['party_code'];
        const color = getPartyColor(partyCode, true, '100.00%');
        const seatCount = forParty['seat_count']
          + forParty['national_list_seat_count'];

        if (seatCount === 0) {
          return [];
        }
        console.debug(seatCount, partyCode);

        return (Array.from(Array(seatCount).keys())).map(
          function(i) {
            const renderedBox = (
              <circle
                cx={x - BOX_DIM / 2}
                cy={y - BOX_DIM / 2}
                r={0.8 * BOX_DIM / 2}
                fill={color}
                stroke='gray'
              />
            );
            cumSeatCount += 1;
            y += BOX_DIM;
            if (y >= BOX_DIM * BOXES_PER_COLUMN) {
              x += BOX_DIM;
              y = 0;
            }

            if (cumSeatCount === 113) {
              x += BOX_DIM * 1.5;
            }

            if (cumSeatCount === 150) {
              x += BOX_DIM * 0.5;
            }

            if (cumSeatCount % 50 === 0) {
              x += BOX_DIM * 0.2;
            }

            return renderedBox;
          },
        )
      }
    );

    const width = BOX_DIM * (225 / BOXES_PER_COLUMN + 7) ;
    const height = BOX_DIM * (BOXES_PER_COLUMN + 1);
    return (
      <svg width={width} height={height}>
        {renderedBoxList}
      </svg>
    )
  }
}
