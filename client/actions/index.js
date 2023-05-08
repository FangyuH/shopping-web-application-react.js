export const updateAll = (input) => {
  return {
    type: "UPDATE_ALL",
    payload: {
      update_state: input,
    },
  };
};
