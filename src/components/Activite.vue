<template>
    <div class="activite add-edit" id="activite">
        <div class="form">
            <div class="form-group">
                <label>Nom de l'activité</label>
                <input type="text" placeholder="Nom de l'activite" class="form-control" v-model="nomActivite">
            </div>
            <label for="Nom du materiel">Materiel</label>
            <div class="materiel-list">
                <table class="table">
                    <tr>
                        <th>Nom</th>
                        <th>N°Serie</th>
                    </tr>
                    <tr v-for="i in materiel" :key="i.numSerie" > 
                        <td>{{ i.nomMateriel }}</td>
                        <td>{{ i.numSerie }}</td>
                    </tr>
                </table>
            </div>
            <div class="form-group">
                <label>Utilisateur</label>
                <input type="text" placeholder="Immatricule de l'utilisateur" class="form-control" v-model="utilisateur">
            </div>
            <div class="form-group">
                <label>Lieu de l'activité</label>
                <input type="text" placeholder="Lieu de l'activité" class="form-control" v-model="lieu">
            </div>
            <div class="btn-groupr btn-group-lg">
                <button class="btn btn-warning add-btn" v-on:click="makeActivite()" :disabled="((materiel.length == 0)  || (this.utilisateur == '') || (this.nomActivite == '') || (this.lieu == ''))"><i class="fa-solid fa-check"></i> Valider</button>
                <button class="btn btn-primary" v-on:click="clear()"><i class="fa-solid fa-remove"></i> Effacer</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "ActiviteComponent",
    props: {
        id: String,
        materiel: Object
    },
    data() {
        return {
            nomActivite: "",
            lieu: "",
            materielForActivite: this.materiel,
            idResponsable: this.id,
            utilisateur: "",
            refActivite: "",
            etat: ""
        };
    },
    methods: {
        clear() {
            this.nomActivite = ""
            this.nomMateriel = "";
            this.utilisateur = "";
            this.lieu = "";
            this.$emit("clearActivite", "");
        },
        makeActivite() {
            // create activite
            let nomMateriel = [];
            let numSerie = [];
            let activiteData = []; // data to send

            if(this.materielForActivite.length > 0) {
                console.log("Indreto izahay nom = " + this.materielForActivite[0].nomMateriel);
                console.log("Indreto izahay numSerie = " + this.materielForActivite[0].numSerie);
                console.log("Ny alavako = " + this.materielForActivite.length);
            }

            for(let i = 0; i < this.materielForActivite.length; i++){
                nomMateriel.push(this.materielForActivite[i].nomMateriel);
                numSerie.push(this.materielForActivite[i].numSerie);
            }
            activiteData = {
                "nomActivite": this.nomActivite,
                "listeNomMateriel": nomMateriel.toString(),
                "listeNumSerie": numSerie.toString(),
                "lieu": this.lieu
            }

            axios.post("http://localhost:9090/techinnova/api/activite/createActivite", activiteData) // send activite request
            .then((response) => {
                this.refActivite = response.data.refActivite; // get last refActivite

                // create utilisation
                let date = new Date().getDate().toString(); 
                for(let i = 0; i < numSerie.length; i++) {
                    let temp = numSerie[i];
                    let utilisationData = {
                        "dateSortie": date,
                        "dateEntree": "Non disponible",
                        "etatSortie": "",
                        "etatEntree": "Non disponible",
                        "numSerie": temp,
                        "imUtilisateur": this.utilisateur,
                        "imResponsable": this.idResponsable,
                        "refActivite": this.refActivite
                    }

                    axios.get("http://localhost:9090/techinnova/api/materiel/getByID/" + numSerie[i])
                    .then((response) => {
                        utilisationData.etatSortie = response.data.etat;
                        
                        axios.post("http://localhost:9090/techinnova/api/utilisation/createUtilisation", utilisationData)
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))

            // update materiel etat
            

            for(let j = 0; j < numSerie.length; j++) { 
                axios.put("http://localhost:9090/techinnova/api/materiel/updateMaterielOccupation/" + numSerie[j] + "/Occupé")
                .then((response) => {
                    console.log(response.data.numSerie);
                    this.clear();
                })
                .catch(error => console.log("error = " + error))
            }
        }
    },
};
</script>

<style lang="scss" scoped>
:disabled{
    opacity: 0.4;
}
.add-edit{
        margin-top: 5%;
        display: flex;
        align-items: center;
        justify-content: center;
        .form{
            width: 400px;
            background-color: #d3d3d3;
            padding: 16px;
            transition: all 0.2s;
            margin-bottom: 50%;
            .form-control{
                padding: 8px;
            }
            .btn-groupr{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .btn{
                    margin: 8px;
                    border-radius: 6px;
                    font-size: 1em;
                    width: 220px;
                }
            }
        }
        .btn-check{
            padding: 4px 8px;
        }
        .nom-materiel{
            padding: 8px;
        }
        .form:hover, .form:focus, .form:focus-visible{
            box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3), 0 15px 15px 0 rgba(0, 0, 0, 0.3);
        }
    }
    .add-btn.desabled{
        background: white;
        cursor: not-allowed;
    }
    @media screen and (max-width: 450px) {
        .add-edit{
            .form{
                width: 250px;
            }
            .btn-groupr{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                .btn{
                    margin: 8px;
                    border-radius: 6px;
                    font-size: 1em;
                    width: 250px;
                }
            }
            .form-control{
                font-size: 14px;
            }
        }
    }
</style>