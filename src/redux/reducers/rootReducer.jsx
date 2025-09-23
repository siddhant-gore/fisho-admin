import { combineReducers } from "redux";
import sideBarReducer from "./sideBarReducer";

const rootReducer = combineReducers({
  sidebar: sideBarReducer,
});

export default rootReducer;
