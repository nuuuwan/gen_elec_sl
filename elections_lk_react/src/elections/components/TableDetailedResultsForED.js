import React, {Component} from 'react';

import {getRegionList, sort} from '../utils/data.js';
import {getPartyList} from '../utils/party.js';
import {renderLoading, renderRegion} from '../utils/render.js';
import {getEDCode} from '../utils/region.js';

import Map from '../components/Map.js';
import TableCandidateList from '../components/TableCandidateList.js';
import TableRowDetailedResults from '../components/TableRowDetailedResults.js';
import TableRowHeaderDetailedResults
  from '../components/TableRowHeaderDetailedResults.js';

export default class TableDetailedResultsForED extends Component {
  constructor(props) {
    super(props);
    this.state = {regionList: undefined};
  }
  async componentDidMount() {
    const edCode = getEDCode(this.props.edDRList);
    const regionList = await getRegionList(edCode);
    this.setState({regionList: regionList});
  }

  render() {
    const regionList = this.state.regionList;
    if (!regionList) {
      return renderLoading();
    }
    const resultList = sort(this.props.edDRList, 'pd_code');
    const resultSummary = this.props.edLatestRS;
    const candidateResultList = this.props.candidateResultList;
    const edCode = getEDCode(resultList);
    const partyList = getPartyList(resultSummary);

    const headerRow = (
      <TableRowHeaderDetailedResults
        partyList={partyList}
        showSummary={true}
        showSeats={false}
        firstRowHeader="Polling Division"
      />
    );

    const rowList = resultList.map(
      function(result, i) {
        return (
          <TableRowDetailedResults
            key={i}
            result={result}
            regionCodeField={'pd_code'}
            partyList={partyList}
          />
        );
      },
    );

    const footerRow = (
      <TableRowDetailedResults
        key='summary'
        result={resultSummary}
        regionCodeField={'pd_code'}
        partyList={partyList}
      />
    );

    const table = (
      <table>
        <thead>{headerRow}</thead>
        <tbody>{rowList}</tbody>
        <tfoot>{footerRow}</tfoot>
      </table>
    )

    return (
      <div id={edCode + '-details'}>
        <h2>{renderRegion(edCode)}</h2>
        <Map
          parentRegionCode={edCode}
          childRegionCodeType={'pd_code'}
          regionList={regionList}
          resultList={resultList}
        />
        {table}
        {(candidateResultList) ? (
          <TableCandidateList
            edCode={edCode}
            candidateResultList={candidateResultList}
          />
        ): null}
      </div>
    );
  }
}