import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默认使用localStorage作为持久化存储

import { reducer } from "../reducer";

export const store = createStore(reducer, applyMiddleware(thunk));
