export const reducer = (
  state = {
    update_state: false,
  },
  action
) => {
  switch (action.type) {
    case "UPDATE_ALL":
      return {
        ...state,
        update_state: action.payload.update_state,
      };
    default:
      return state;
  }
};
