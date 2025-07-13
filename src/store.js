import { createStore } from "redux";

const initialState = {
    balance: 0,
    load: 0,
    loanPurpose: "",
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case "account/deposit":
            return { ...state, balance: state.balance + action.payload };
        case "account/withdraw":
            return { ...state, balance: state.balance - action.payload };
        case "account/requestLoan":
            if (state.loan > 0) return state;
            return {
                ...state,
                loan: action.payload.amount,
                loanPurpose: action.payload.purpose,
                balance: state.balance + action.payload.amount,
            };
        case "action/payLoan":
            return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan };
        default:
            return state;
    }
}

const store = createStore(reducer);

store.dispatch({ type: "account/deposit", payload: 500 });
console.log(store.getState());

store.dispatch({ type: "account/withdraw", payload: 200 });
console.log(store.getState());

store.dispatch({
    type: "account/requestLoan",
    payload: { amount: 1000, purpose: "Buy a new car" },
});
console.log(store.getState());

store.dispatch({ type: "account/payLoan" });
console.log(store.getState());
