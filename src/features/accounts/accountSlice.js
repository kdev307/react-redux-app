import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    balance: 0,
    load: 0,
    loanPurpose: "",
    isLoading: false,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        deposit(state, action) {
            state.balance = state.balance + action.payload;
            state.isLoading = false;
        },
        withdraw(state, action) {
            state.balance -= action.payload;
        },
        requestLoan: {
            prepare(amount, purpose) {
                return {
                    payload: { amount, purpose },
                };
            },
            reducer(state, action) {
                if (state.loan > 0) return;
                state.loan = action.payload.amount;
                state.loanPurpose = action.payload.purpose;
                state.balance += action.payload.amount;
            },
        },
        payLoan(state, action) {
            state.balance -= state.loan;
            state.loan = 0;
            state.loanPurpose = "";
        },
        convertingCurrency(state) {
            state.isLoading = true;
        },
    },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
    if (currency === "USD") return { type: "account/deposit", payload: amount };

    // Asynchronous code using thunk middleware
    return async function (dispatch, getState) {
        dispatch({ type: "account/convertingCurrency" });
        // API Call
        const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
        );
        const data = await res.json();
        const converted = data.rates.USD;
        // return action
        dispatch({ type: "account/deposit", payload: converted });
    };
}

export default accountSlice.reducer;
