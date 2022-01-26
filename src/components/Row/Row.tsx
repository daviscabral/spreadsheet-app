import { FunctionComponent } from "react";
import classnames from "classnames";

import "./Row.css";

interface RowProps {
  children?: React.ReactNode;
  header?: boolean;
}

export const Row: FunctionComponent<RowProps> = ({
  children,
  header = true,
}) => {
  return (
    <tr className={classnames("Row", { "Row--header": header })}>{children}</tr>
  );
};
