import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        msg: "I am a store",
        nomActivite: "",
        materielForActivite: [],
        imUtilisateu: "",
        lieu: "",
        loginId: "",
    },
});