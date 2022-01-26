import { Dispatch, FunctionComponent } from "react";
import { times } from "ramda";

import Row from "components/Row";
import Col from "components/Col";
import { numberToLetter } from "utils/strings";

import "./Table.css";
import { SpreadsheetAction } from "pages/App";

interface TableProps {
  data: any[];
  rows: number;
  cols: number;
  dispatch: Dispatch<SpreadsheetAction>;
}

export const Table: FunctionComponent<TableProps> = ({
  data,
  rows,
  cols,
  dispatch,
}) => {
  if (Object.keys(data).length === 0) {
    return null;
  }
  return (
    <table className="Table">
      <thead>
        <Row>
          <Col header col={"00"} row={0}></Col>
          {times((col) => {
            const letter = numberToLetter(col + 1);
            return (
              <Col header key={letter} col={letter} row={0}>
                {letter}
              </Col>
            );
          }, cols)}
        </Row>
      </thead>
      <tbody>
        {times((row) => {
          return (
            <Row key={row}>
              <Col key={0} header col={"00"} row={row}>
                {row + 1}
              </Col>
              {times((col) => {
                const letter = numberToLetter(col + 1);
                return (
                  <Col
                    key={col + 1}
                    col={letter}
                    row={row + 1}
                    data={data}
                    cell={data[row + 1][letter]}
                    dispatch={dispatch}
                  >
                    {data[row + 1][letter].data}
                  </Col>
                );
              }, cols)}
            </Row>
          );
        }, rows)}
      </tbody>
    </table>
  );
};
