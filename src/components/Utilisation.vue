<template>
    <div class="container">
        <div class="field">
            <div class="search-field">
                <input type="date" placeholder="Date de Sortie" class="search-input">
                <button class="search-btn"><i class="fa-solid fa-search"></i></button>
            </div>
        </div>
        <div class="table table-striped table-hover table-condensed">
            <!-- <table class="table">
                <thead>
                    <tr>
                        <th>Date de sortie</th>
                        <th>Date d'entrée</th>
                        <th>Etat de sortie</th>
                        <th>Etat d'entrée</th>
                        <th>N° de serie</th>
                        <th>Utilisateur</th>
                        <th>Responsable</th>
                        <th>Référence</th>
                        <th colspan="2" style="text-align: center;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in utilisation" v-bind:key="i.id">
                        <td>{{ i.dateSortie }}</td>
                        <td>{{ i.dateEntree }}</td>
                        <td>{{ i.etatSortie }}</td>
                        <td>{{ i.etatEntree }}</td>
                        <td>{{ i.numSerie }}</td>
                        <td>{{ i.imUtilisateur }}</td>
                        <td>{{ i.imResponsable }}</td>
                        <td>{{ i.refActivite }}</td>
                        <td><a href="#add"><button class="edit-btn btn" @click="showEditForm(idTemp = i.id);"><i class="fa-solid fa-edit"></i></button></a></td>
                        <td><button class="remove-btn btn" @click="remove(idTemp = i.id);"><i class="fa-solid fa-remove"></i></button></td>
                    </tr>
                </tbody>
            </table> -->
            <div class="example" v-for="i in utilisation" v-bind:key="i.id">
                <p>Date de sortie: {{ i.dateSortie }}</p>
                <p>Date d'entrée: {{ i.dateEntree }}</p>
                <p>Etat de sortie: {{ i.etatSortie }}</p>
                <p>Etat d'entrée: {{ i.etatEntree }}</p>
                <p>N°Serie: {{ i.numSerie }}</p>
                <p>Utilisateur: {{ i.imUtilisateur }}</p>
                <p>Responsable: {{ i.imResponsable }}</p>
                <p>Référence de l'activité: {{ i.refActivite }}</p>
                <div class="controller">
                    <p><a href="#add"><button class="edit-btn btn" @click="showEditForm(idTemp = i.id);"><i class="fa-solid fa-edit"></i></button></a></p>
                    <p v-if="typeFromDB == 'SuperUtilisateur'"><button class="remove-btn btn" @click="remove(idTemp = i.id, numSerieTemp = i.numSerie);"><i class="fa-solid fa-remove"></i></button></p>
                </div>
            </div>
        </div>
    </div>
    <div class="add-edit" v-show="active" id="add" style="margin-bottom: 5%;">
        <div class="form">
            <form>
                <legend style="text-align: center;">{{ legend }}</legend>
                <div class="form-group">
                    <label>Date de sortie</label><br>
                    <input type="date" class="form-control" v-model="dateSortie">
                </div>
                <div class="form-group">
                    <label>Date d'entrée</label><br>
                    <input type="date" class="form-control" v-model="dateEntree">
                </div>
                <div class="form-group">
                    <label>Etat d'entrée</label><br>
                    <select name="etatSortie" id="etatSortie" class="form-control" v-model="etatEntree">
                        <option value="Non disponible">Non disponible</option>
                        <option value="Bon">Bon</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Détruit">Détruit</option>
                    </select>
                </div>
            </form>                
            <div class="btn-groupr btn-group-lg">
                <button class="btn btn-success edit-btn" v-on:click="editUtilisation()"><i class="fa-solid fa-edit"></i> Modifier</button>
                <button class="btn btn-primary" v-on:click="cancel()"><i class="fa-solid fa-remove"></i> Annuler</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "UtilisationComponent",
    data() {
        return{
            utilisation: [],
            dateSortie: "",
            dateEntree: "",
            etatEntree: "",
            etatSortie: "",
            idTemp: "",
            id: "",
            imUtilisateur: "",
            imResponsable: "",
            refActivite: "",
            numSerieTemp: "",

            legend: "",
            data: "",
            disabled: true,

            active: false,
            typeFromDB: ""
        };
    },
    methods: {
        // READ
        getUtilisation() {
            axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/get/" + document.cookie)
            .then( (user) => {
                this.typeFromDB = user.data.typeUtilisateur;
                axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisation/getUtilisation")
                .then(response => this.utilisation = response.data)
                .catch(error => console.log(error))
            })
            .catch((error) => (console.log(error)))
        },        

        // CLEAR FORM
        clearForm() {
            this.dateSortie = "";
            this.dateEntree = "";
            this.etatEntree = "";
            this.id = "";
            this.idTemp = "";
            this.imUtilisateur = "";
            this.imResponsable = "";
            this.refActivite = "";
        },

        // SHOW EDIT UTILISATEION FORM
        showEditForm() {
            //console.log("EEEEEEEEEEEE = " + this.idTemp);
            this.active = true;
            this.legend = "Modification";
            for(let i = 0;  i < this.utilisation.length; i++){
                if(this.utilisation[i].id == this.idTemp){
                    this.id = this.idTemp;
                    this.dateSortie = this.utilisation[i].dateSortie.split("-").reverse().join("-");
                    if(this.utilisation[i].dateEntree != "Non disponible") {
                        this.dateEntree = this.utilisation[i].dateEntree.split("-").reverse().join("-");
                    }else{
                        this.dateEntree = this.utilisation[i].dateEntree;
                    }
                    this.etatEntree = this.utilisation[i].etatEntree;
                    this.etatSortie = this.utilisation[i].etatSortie;
                    this.imResponsable = this.utilisation[i].imResponsable;
                    this.imUtilisateur = this.utilisation[i].imUtilisateur;
                    this.refActivite = this.utilisation[i].refActivite;

                    break;
                }
            }
        },

        // CANCEL EDIT FORM
        cancel() {
            this.active = false;
        },

        // EDIT UTILISATEION REQUEST
        editUtilisation() {
            var data = {
                "dateSortie": this.dateSortie.split("-").reverse().join("-"),
                "dateEntree": "Non disponible",
                "etatSortie": this.etatSortie,
                "etatEntree": this.etatEntree,
                "numSerie": this.numSerie,
                "imUtilisateur": this.imUtilisateur,
                "imResponsable": this.imResponsable,
                "refActivite": this.refActivite
            }
            
            if(this.dateEntree != "") {
                data.dateEntree = this.dateEntree.split("-").reverse().join("-");
            }

            axios.put("https://techinnova-latest.onrender.com/techinnova/api/utilisation/updateUtilisation/" + this.idTemp, data)
            .then(response => console.log(response))
            .catch(error => console.log(error))

            this.clearForm();
            this.cancel();
        },

        //REMOVE UTILISATION REQUEST
        remove() {
            console.log(this.idTemp);
            if(confirm("Voulez-vous supprimer")) {
                axios.delete("https://techinnova-latest.onrender.com/techinnova/api/utilisation/deleteUtilisation/" + this.idTemp)
                .then((response) => {
                    console.log(response)

                    //// update materiel etat 
                    axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMaterielOccupation/" + this.numSerieTemp + "/Libre")
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(error => console.log("error = " + error))
                })
                .catch(error => console.log(error))
            }
        },
    },

    // HOOKS
    created() {
        this.getUtilisation();

        setInterval(() => {
            this.getUtilisation();
        }, 1500)
    }
}
</script>

<style lang="scss" scoped>
    $co1: #FFFF00;
    $co2: #595959;
    $co3: #808080;

    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    
    .example{
        color: #ffffff;
        border: 1px solid $co3;
        padding: 10px;
        border-radius: 4px;
        margin: 8px 0px;
        transition: all 0.18s;
        .controller{
            display: flex;
            align-items: center;
            justify-content: end;
        }
    }
    .example:hover{
        transform: scale(0.99);
    }
    @media screen and (max-width: 470px) {
            .field{
                display: block;
                .add-field{
                    .add-btn{
                        font-size: 12px;
                    }
                }
                .search-field{
                    border: 2px solid rgba($color: $co2, $alpha: 0.5);
                    border-radius: 3px;
                    margin: 8px 0px;
                    padding: 6px 18px;
                    transition: all 0.4s;
                    border: 1px solid #4120ff;
                    box-shadow: 3px 3px 2px rgba($color: $co2, $alpha: 0.3);
                    .search-input, .search-btn{
                        outline: none;
                        border: none;
                        background: transparent;
                        color:white;
                        font-size: 12px;
                    }
                    .search-btn{
                        display: none;
                    }
                }
            }
            
        }
    .container{
        font-family: Nunito;
        .field{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .add-field{
                .add-btn{
                    padding: 8px;
                }
            }
            .search-field{
                border: 2px solid rgba($color: $co2, $alpha: 0.5);
                border-radius: 3px;
                padding: 6px 18px;
                transition: all 0.4s;
                border: 1px solid #4120ff;
                box-shadow: 3px 3px 2px rgba($color: $co2, $alpha: 0.3);
                .search-input, .search-btn{
                    outline: none;
                    border: none;
                    background: transparent;
                    color:white;
                }
                .search-btn{
                    padding-left: 8px;
                }
            }
        }
        .table{
            margin-top: 10px;
            thead{
                background: $co1;
            }
            .btn{
                width: 35px;
                height: auto;
                padding: 5px;
                margin-right: 8px;
                transition: all 0.2s;
                color: #FFFFFF;
            }
            .btn:hover, .btn:focus{
                transform: scale(0.95);
            }
            .remove-btn{
                background-color: #FF0000;
            }
            .edit-btn{
                background-color: #085234;
            }
        }
    }
    .add-edit{
        margin-top: 5%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        .form{
            width: 400px;
            background-color: #d3d3d3;
            padding: 16px;
            transition: all 0.2s;
            .form-control{
                padding: 8px;
            }
            .btn-groupr{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .btn{
                    width: 220px;
                    margin: 8px;
                    border-radius: 6px;
                    font-size: 1em;
                }
            }
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
                    width: 220px;
                }
            }
            .form-control{
                font-size: 14px;
            }
        }
    }
</style>