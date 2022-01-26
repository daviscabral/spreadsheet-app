import { useEffect, useReducer } from "react";

import Table from "components/Table";
import { numberToLetter } from "utils/strings";

import "./App.css";

export const ROWS = 100;
export const COLS = 30;

type SpreadsheetState = {
  data: any;
};

export type SpreadsheetAction = {
  type: "UPDATE_VALUE" | "UPDATE_DEPS" | "UPDATE_REF" | "SETUP";
  value: null | string | object;
  row: number;
  col: string;
  error: string;
};

function App() {
  const initialState = {
    data: {},
  };

  const [state, dispatch] = useReducer(
    (state: SpreadsheetState, action: SpreadsheetAction) => {
      const { row, col, value, error } = action;

      console.log("action", action);

      switch (action.type) {
        case "SETUP":
          const data: any = {};
          for (let curRow = 0; curRow < ROWS; curRow++) {
            data[curRow + 1] = data[curRow + 1] || {};
            for (let curCol = 0; curCol < COLS; curCol++) {
              const letter = numberToLetter(curCol + 1);
              data[curRow + 1][letter] = {
                data: "",
                ref: null,
                deps: [],
              };
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              ...data,
            },
          };

        case "UPDATE_DEPS":
          const ref = state.data[row][col];

          let newState = {
            ...state.data,
            [row]: {
              ...state.data[row],
              [col]: {
                ...state.data[row][col],
                deps: [...ref.deps, value],
              },
            },
          };

          newState = {
            ...newState,
            // @ts-ignore
            [value.row]: {
              // @ts-ignore
              ...newState[value.row], // @ts-ignore
              [value.col]: {
                // @ts-ignore
                ...newState[value.row][value.col], // @ts-ignore
                data: ref.data,
              }, // @ts-ignore
            },
          };

          return {
            ...state,
            data: {
              ...state.data,
              ...newState,
            },
          };

        case "UPDATE_VALUE": {
          const cell = state.data[row][col];

          let newState = {
            ...state.data,
            [row]: {
              ...state.data[row],
              [col]: {
                ...state.data[row][col],
                data: value,
                error,
              },
            },
          };

          const updateDeps = (dep: any) => {
            newState[dep.row][dep.col].data = value;
            newState[dep.row][dep.col].deps.map(updateDeps);
          };

          cell.deps.map(updateDeps);

          return {
            ...state,
            data: {
              ...state.data,
              [row]: {
                ...state.data[row],
                [col]: {
                  ...state.data[row][col],
                  data: value,
                  error,
                },
              },
            },
          };
        }

        case "UPDATE_REF": {
          return {
            ...state,
            data: {
              ...state.data,
              [row]: {
                ...state.data[row],
                [col]: {
                  ...state.data[row][col],
                  ref: value,
                },
              },
            },
          };
        }

        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    dispatch({ type: "SETUP", col: "", row: 0, value: "", error: "" });
  }, []);

  return (
    <div className="App">
      <Table data={state.data} rows={ROWS} cols={COLS} dispatch={dispatch} />
    </div>
  );
}

export default App;
