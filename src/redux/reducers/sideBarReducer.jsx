const initialState = {
  selected: "candidates",
};

export default function sideBarReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_SELECTED": {
      state = {
        ...state,
        selected: action.payload,
      };
      return state;
    }
    default:
      return state;
  }
}
