import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  Dispatch,
} from "react";
import classnames from "classnames";

import { ROWS, SpreadsheetAction } from "pages/App";

import "./Col.css";
import { Certificate } from "crypto";

interface ColProps {
  children?: React.ReactNode;
  col: string;
  row: number;
  dispatch?: Dispatch<SpreadsheetAction>;
  data?: any;
  cell?: any;
  header?: boolean;
}

export const Col: FunctionComponent<ColProps> = ({
  children,
  row,
  col,
  data,
  cell,
  dispatch,
  header = false,
}) => {
  const [editable, setEditable] = useState(false);
  const [active, setActive] = useState(false);

  const tdRef = useRef<HTMLTableCellElement>(null);
  const currentValueRef = useRef("");

  useEffect(() => {
    if (tdRef.current && cell) {
      tdRef.current.innerText = cell.data;
    }
  }, [cell]);

  const handleOnClick = () => {
    setActive(true);
    currentValueRef.current = tdRef.current?.innerText as string;
    tdRef.current?.focus();
  };

  const handleDoubleClick = () => {
    setEditable(true);
    setActive(true);
    currentValueRef.current = tdRef.current?.innerText as string;
    if (tdRef.current && cell.ref) {
      tdRef.current.innerText = `=${cell.ref.col}${cell.ref.row}`;
    }
    tdRef.current?.focus();
  };

  const commitChanges = () => {
    if (!dispatch || currentValueRef.current === tdRef.current?.innerText) {
      return;
    }

    let value = tdRef.current?.innerText || "";
    let error = "";

    if (String(value).startsWith("=")) {
      const matches = new RegExp("([A-Za-z]+)([0-9]+)").exec(String(value));
      if (matches) {
        const [, refCol, refRow] = matches;
        if (Number(refRow) > ROWS) {
          value = "#ERROR";
          error = "Invalid reference";

          dispatch({
            type: "UPDATE_VALUE",
            value,
            row,
            col,
            error,
          });
        } else {
          const ref = data[Number(refRow)][refCol];
          value = ref.data;

          dispatch({
            type: "UPDATE_DEPS",
            value: { col, row },
            row: Number(refRow),
            col: refCol,
            error,
          });

          dispatch({
            type: "UPDATE_REF",
            value: { col: refCol, row: refRow },
            row,
            col,
            error,
          });
        }
      }
    } else {
      dispatch({
        type: "UPDATE_VALUE",
        value,
        row,
        col,
        error,
      });
    }
  };

  const handleOnBlur = () => {
    commitChanges();
    setEditable(false);
    setActive(false);
  };

  const handleOnFocus = () => {
    setActive(true);
  };

  const handleOnKeyDown = (event: any) => {
    if (event.code == "Enter") {
      setEditable(false);
      event.preventDefault();
      commitChanges();
    } else if (event.code == "Tab" || event.code.startWith == "Arrow") {
      setEditable(false);
      setActive(false);
      commitChanges();
    } else if (!editable) {
      setEditable(true);
      tdRef.current?.focus();
    }
  };

  if (header) {
    return <th className="Col Col--header">{children}</th>;
  }

  return (
    <td
      tabIndex={1}
      ref={tdRef}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      className={classnames("Col", {
        "Col--active": active,
        "Col--editing": editable,
        "Col--error": cell.error,
      })}
      onClick={handleOnClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      onKeyDown={handleOnKeyDown}
      title={cell.error}
    >
      {children}
    </td>
  );
};
