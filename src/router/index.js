import { createRouter, createWebHistory } from "vue-router"

import Materiel from "../view/MaterielView.vue"
import EntreeSortie from "../view/EntreeSortieView.vue"
import Utilisateur from "../view/UtilisateurView.vue"

const routes = [
    {
        path: "/",
        name: "materiel",
        component: Materiel
    },
    {
        path: "/entreeSortie",
        name: "entreeSortie",
        component: EntreeSortie
    },
    {
        path: "/utilisateur",
        name: "utilisateur",
        component: Utilisateur
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;