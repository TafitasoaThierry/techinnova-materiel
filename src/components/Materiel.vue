<template>
    <div class="container">
        <div class="field">
            <div class="add-field">
                <a href="#add"><button class="btn btn-primary add-btn" v-on:click="showAddForm()">Ajouter</button></a>
                <a href="#activite"><button class="btn btn-primary add-btn" style="margin-left: 8px; background-color: transparent; color: #ffffff;">Activite</button></a>
            </div>
            <div class="search-field">
                <input type="text" placeholder="N° de serie, nom" class="search-input" v-model="search" @keyup="searchMateriel()">
                <button class="search-btn"><i class="fa-solid fa-search" @click="searchMateriel()"></i></button>
            </div>
        </div>
        <div class="box" id="main-box" v-show="search.length == 0">
            <ul class="box-content" v-for="materiel in  materiel" v-bind:key="materiel.numSerie">
                <li><img  v-bind:src="materiel.image" class="img" width="100%" height="200px" style="border: 1px solid #595959; border-radius: 3px;"></li>
                <li style="margin-top: 3px;">N°Serie: {{ materiel.numSerie }}</li>
                <li>Nom: {{ materiel.nomMateriel }}</li>
                <li>Marque: {{ materiel.marque }}</li>
                <li>Etat: {{ materiel.etat }}</li>
                <li v-if="materiel.occupation == 'Libre'">Occupation: <span style="color: green;" >{{ materiel.occupation }}</span></li>
                <li v-else>Occupation: <span style="color: red;">{{ materiel.occupation }}</span></li>
                <li style="display: flex; justify-content: right;">
                    <a href="#add"><button class="edit-btn btn" @click="showEditForm(numSerieTemp = materiel.numSerie)"><i class="fa-solid fa-edit"></i></button></a>
                    <button class="remove-btn btn" @click="remove(numSerieTemp = materiel.numSerie)"><i class="fa-solid fa-remove"></i></button>
                    
                    <div v-if="materiel.occupation == 'Libre'">
                        <button class="check-box btn">
                            <input type="checkbox" class="unique-check-box" id="check-box" @click="checkBox(nomMaterielForActivite = materiel.nomMateriel, numSerieForActivite = materiel.numSerie)">
                        </button>
                    </div>
                    <div v-else>
                        <button class="check-box btn unique-check-box2" v-on:click="materielOccupe()">
                        </button>
                    </div>
                </li>
                <!-- <li>Prix: {{ materiel.prix }}</li> -->
            </ul>
        </div>
        <div class="box" id="search-box" v-show="search.length > 0">
            <ul class="box-content" v-for="materielSearch in  materielSearch" v-bind:key="materielSearch.numSerie">
                <li><img  v-bind:src="materielSearch.image" class="img" width="100%" height="200px" style="border: 1px solid rgba(0,0,0,0.3); border-radius: 3px;"></li>
                <li style="margin-top: 3px;">N°Serie: {{ materielSearch.numSerie }}</li>
                <li>Nom: {{ materielSearch.nomMateriel }}</li>
                <li>Marque: {{ materielSearch.marque }}</li>
                <li>Etat: {{ materielSearch.etat }}</li>
                <li v-if="materielSearch.occupation == 'Libre'">Occupation: <span style="color: green;" >{{ materielSearch.occupation }}</span></li>
                <li v-else>Occupation: <span style="color: red;">{{ materielSearch.occupation }}</span></li>
                <li style="display: flex; justify-content: right;">
                    <a href="#add"><button class="edit-btn btn" @click="showEditForm(numSerieTemp = materielSearch.numSerie)"><i class="fa-solid fa-edit"></i></button></a>
                    <button class="remove-btn btn" @click="remove(numSerieTemp = materielSearch.numSerie)"><i class="fa-solid fa-remove"></i></button>
                </li>
                <!-- <li>Prix: {{ materiel.prix }}</li> -->
            </ul>
        </div>
        <p v-show="nullSearch" style="text-align: center; opacity: 0.6;; font-size: 22px; padding: 30px 0; color:#ffffff;">Résulat introuvable</p>
    </div>
    <div class="add-edit" v-show="active" id="add">
        <div class="form">
            <form>
                <legend style="text-align: center;">{{ legend }}</legend>
                <div class="form-group">
                    <p style="text-align: center; margin: 8px 0; border-radius: 10px;">Image<br><img v-bind:src="img" alt="" width="220px" height="200px" style="border: 1px solid rgba(0,0,0,0.3); border-radius: 10px;"></p>
                    <input type="file" placeholder="Image" class="form-control" @change="showImage()" >
                </div>
                <div class="form-group">
                    <label>Numero de serie</label><br>
                    <input type="text" name="numSerie" placeholder="N° de serie" class="form-control" @keyup="checkSerie()" :readonly="legend == 'Modifier un materiel'" v-model="numSerie">
                    <p><small style="color: red;" v-if="numSerieExist">N° de serie déjà pris</small></p>
                </div>
                <div class="form-group">
                    <label>Nom du materiel</label><br>
                    <input type="text" placeholder="Nom du materiel" class="form-control" v-model="nom">
                </div>
                <div class="form-group">
                    <label>Marque</label><br>
                    <input type="text" placeholder="Marque" class="form-control" v-model="marque">
                </div>
                <div class="form-group">
                    <label>Etat</label><br>
                    <select name="userType" id="userType" class="form-control" v-model="etat">
                        <option selected>Bon</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Détruit">Détruit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Occupation</label><br>
                    <select name="occupation" id="occupation" class="form-control" v-model="occupation">
                        <option selected>Libre</option>
                        <option value="Occupé">Occupé</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Prix</label><br>
                    <input type="number" placeholder="Prix" min="0" class="form-control" v-model="prix">
                </div>
            </form>                
            <div class="btn-groupr btn-group-lg">
                <button class="btn btn-warning add-btn" v-on:click="addMateriel()" :disabled="((legend == 'Modifier un materiel')  || (this.numSerieExist == true) || (this.img == null) || (numSerie == '') || (nom == '') || (marque == '') || (prix == ''))"><i class="fa-solid fa-add"></i> Ajouter</button>
                <button class="btn btn-success edit-btn" v-on:click="editMateriel()" :disabled="((legend == 'Ajout de materiel') || (numSerie == '') || (nom == '') || (marque == '') || (prix == ''))"><i class="fa-solid fa-edit"></i><a href="#iii"></a> Modifier</button>
                <button class="btn btn-primary" v-on:click="cancel()" ><i class="fa-solid fa-remove"></i> Annuler</button>
            </div>
        </div>
    </div>
    <div class="activite add-edit" id="activite" style="margin-bottom: 5%;">
        <div class="form">
            <legend style="text-align: center;">Activité</legend>
            <div class="form-group">
                <label>Nom de l'activité</label>
                <input type="text" placeholder="Nom de l'activite" class="form-control" v-model="nomActivite">
            </div>
            <label for="Nom du materiel">Materiel</label>
            <div class="materiel-list">
                <table class="table">
                    <tr>
                        <th>Nom materiel</th>
                        <th>N°Serie</th>
                    </tr>
                    <tr v-for="i in materielForActivite" :key="i.numSerie" > 
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
            <div class="form-group">
                <label>Date de sortie</label>
                <input type="date" placeholder="Date de sortie" class="form-control" v-model="dateSS">
            </div>
            <div class="btn-groupr btn-group-lg">
                <button class="btn btn-warning add-btn" style="width: 220px;" v-on:click="makeActivite()" :disabled="((materielForActivite.length == 0)  || (this.utilisateur == '') || (this.nomActivite == '') || (this.lieu == ''))"><i class="fa-solid fa-check"></i> Valider</button>
                <button class="btn btn-primary" style="width: 220px;" v-on:click="clearActivite()"><i class="fa-solid fa-remove"></i> Effacer</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import "../styles/bootstrap-4.0.0-dist/bootstrap.min.css"
import "../styles/fontawesome-6.6.0-web/css/all.min.css"

export default {
    
    name: "MaterielComp",
    props: {
        userID: String
    },
    data() {
        return{
            // data used by MATERIEL
            materiel: [],   
            meterieltemp: [],    
            img: null, // src for input image
            numSerieTemp: "",
            numSerieExist: false,
            numSerie: "",
            image: "", // image data base64
            occupation: "Libre",
            etat: "Bon",
            prix: 0,
            marque: "",
            nom: "",
            materielSearch: [],

            src: "", // for displaying image on edit
            count: "",
            legend: "",

            // show-hide controller
            active: false,
            search: "",
            nullSearch: false,
            materielForActivite: [],
            numSerieForActivite: "",
            nomMaterielForActivite: "",

            // activite data
            nomActivite: "",
            lieu: "",
            idResponsable: "2324TI",
            utilisateur: "",
            refActivite: "",
            etatSortie: "",
            dateSS: ""
        }
    },
    methods: {
        // SEND DATA REQUEST
        makeActivite() {
            // create activite
            let nomMateriel = [];
            let numSerie = [];
            let activiteData = []; // data to send

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

            axios.post("https://techinnova-latest.onrender.com/techinnova/api/activite/createActivite", activiteData) // send activite request
            .then((response) => {
                this.refActivite = response.data.refActivite; // get last refActivite

                // create utilisation
                /*
                let date = new Date();
                let dd = date.getDate().toString();
                let mm = (date.getMonth() + 1).toString();
                let yyyy = date.getFullYear();
                if(mm.length == 1) {
                    mm = "0" + mm;
                }
                if(dd.length == 1) {
                    dd = "0" + dd;
                }
                let format = `${yyyy}-${mm}-${dd}`;
                */
                var dateNN = "";
                if(this.dateSS.toString() == "") {
                    let date = new Date();
                    let dd = date.getDate().toString();
                    let mm = (date.getMonth() + 1).toString();
                    let yyyy = date.getFullYear();
                    if(mm.length == 1) {
                        mm = "0" + mm;
                    }
                    if(dd.length == 1) {
                        dd = "0" + dd;
                    }
                    dateNN = `${dd}-${mm}-${yyyy}`;
                }else {
                    dateNN = this.dateSS.toString().split("-").reverse().join("-");
                }
                for(let i = 0; i < numSerie.length; i++) {
                    let temp = numSerie[i];
                    let utilisationData = {
                        "dateSortie": dateNN,
                        "dateEntree": "Non disponible",
                        "etatSortie": "",
                        "etatEntree": "Non disponible",
                        "numSerie": temp,
                        "imUtilisateur": this.utilisateur,
                        "imResponsable": document.cookie,
                        "refActivite": this.refActivite
                    }

                    axios.get("https://techinnova-latest.onrender.com/techinnova/api/materiel/getByID/" + numSerie[i]) // get ETAT of each materiel
                    .then((response) => {
                        utilisationData.etatSortie = response.data.etat;
                        
                        axios.post("https://techinnova-latest.onrender.com/techinnova/api/utilisation/createUtilisation", utilisationData) // send UTILISATION request
                        .then((response) => {
                            console.log(response.data);

                            //// update materiel etat 
                            axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisation/getUtilisation/" + this.refActivite)
                            .then((response) => {
                                let u = response.data;
                                let date = new Date();
                                let dd = date.getDate().toString();
                                let mm = (date.getMonth() + 1).toString();
                                let yyyy = date.getFullYear();
                                if(mm.length == 1) {
                                    mm = "0" + mm;
                                }
                                if(dd.length == 1) {
                                    dd = "0" + dd;
                                }
                                let today = `${dd}-${mm}-${yyyy}`;

                                //// update materiel etat
                                for(let k = 0; k < u.length; k++) {
                                    if(u[k].dateSortie == today) {
                                        console.log("dateSortie = " + u[k].dateSortie);

                                        axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMaterielOccupation/" + u[k].numSerie + "/Occupé")
                                        .then((response) => {
                                            console.log(response.data.numSerie);
                                            this.clearActivite();
                                        })
                                        .catch(error => console.log("error = " + error))
                                    }
                                }
                                this.clearActivite();
                            })
                            .catch((error) => (console.log("error = " + error)))
                            
                            /////
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
        },

        // clear activite form and check box
        clearActivite(){
            this.materielForActivite = [];
            this.numSerieForActivite = "";
            this.nomMaterielForActivite = "";

            this.nomActivite = ""
            this.nomMateriel = "";
            this.utilisateur = "";
            this.lieu = "";

            for(let i = 0; i < this.materiel.length*2; i++){
                if(document.querySelectorAll(".unique-check-box")[i] !=  undefined) {
                    document.querySelectorAll(".unique-check-box")[i].checked = false;
                } 
            }
        },
        materielOccupe() {
            alert("Materiel en cours d'utilisation");
        },

        // input search
        searchMateriel() {
            let namePattern = new RegExp(this.search, "i");
            let numSeriePattern = new RegExp(this.search, "i");
            let n = this.materielTemp.length;
            this.materielSearch = [];
            for(let i = 0; i < n; i++) {
                if((this.materielTemp[i].nomMateriel.search(namePattern) >= 0) || (this.materielTemp[i].numSerie.search(numSeriePattern) >= 0)) {
                    this.materielSearch.push(this.materielTemp[i]);
                }
            }
            if(this.materielSearch.length == 0 && this.search.length > 0){
                this.nullSearch = true;
            }else{
                this.nullSearch = false;
            }
        },

        // checkbox ckecked onclick
        checkBox() {
            let numSerie = this.numSerieForActivite;
            let n = this.materielForActivite.length;
            let m = this.materielForActivite;
            let detector = 0;
            if(n > 0) {
                for(let i = 0; i < n; i++){
                    if(m[i].numSerie == numSerie) {
                        detector++;
                        for(let j = i; j < n; j++){
                            this.materielForActivite[j] = this.materielForActivite[j + 1];
                        }
                        //console.log("Already taked");
                        this.materielForActivite.pop();
                        break;
                    }
                }
                if(detector == 0) {
                    this.materielForActivite.push({"nomMateriel":this.nomMaterielForActivite, "numSerie":this.numSerieForActivite});
                    console.log("Materiel = " + this.materielForActivite);
                }
            }else{
                this.materielForActivite.push({"nomMateriel":this.nomMaterielForActivite, "numSerie":this.numSerieForActivite});
                //console.log("Indreto izahay nom = " + this.nomMaterielForActivite);
                //console.log("Indreto izahay numSerie = " + this.numSerieForActivite);
            }
        },

        // check numSerie on add materiel
        checkSerie() {
            for(let i = 0; i < this.materiel.length; i++){
                if(this.numSerie == this.materiel[i].numSerie){
                    this.numSerieExist = true;
                    break;
                }else{
                    this.numSerieExist = false;
                }
            }
        },

        /* fonction pour gerer les materiels */
        // OBTENIR LES LISTES MATERIELS
        getMateriel() {
            if(document.cookie != "" && document.cookie != "null") {
                axios.get("https://techinnova-latest.onrender.com/techinnova/api/materiel/getMateriel")
                .then((response) => {
                    this.materiel = [];
                    this.materiel = response.data;
                    for(let i = 0; i < response.data.length; i++){
                        this.materiel[i].image = atob(this.materiel[i].image);
                        this.materielTemp = this.materiel;
                    }

                    axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisation/getUtilisation")
                    .then((response) => {
                        let u = response.data;
                        let date = new Date();
                        let dd = date.getDate().toString();
                        let mm = (date.getMonth() + 1).toString();
                        let yyyy = date.getFullYear();
                        if(mm.length == 1) {
                            mm = "0" + mm;
                        }
                        if(dd.length == 1) {
                            dd = "0" + dd;
                        }
                        let today = `${dd}-${mm}-${yyyy}`;

                        //// update materiel etat
                        for(let k = 0; k < u.length; k++) {
                            if(u[k].dateSortie == today && u[k].dateEntree == "Non disponible") {
                                //console.log("dateSortie = " + u[k].dateSortie);
                                axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMaterielOccupation/" + u[k].numSerie + "/Occupé")
                                .then((response) => {
                                    if(response.numSerie == ""){
                                        console.log("status.ok");
                                    }
                                })
                                .catch(error => console.log(error))
                            }else{
                                axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMaterielOccupation/" + u[k].numSerie + "/Libre")
                                .then((response) => {
                                    if(response == undefined){
                                        console.log("status.ok");
                                    }
                                })
                                .catch(error => console.log(error))
                            }
                        }
                    })
                    .catch(error => console.log(error))
                    ////
                })
                .catch(error => console.log(error))
            }
        },

        // CLEAR FORM POUR EVITER LES CACHES SUR LES FORMULAIRES
        clearForm() {
            this.numSerie = "";
            this.image = null;
            this.img = null;
            this.src = "";
            this.occupation = "Libre";
            this.etat = "Bon";
            this.prix = 0;
            this.marque = "";
            this.nom = "";
            document.querySelector("input[type = file]").value = null;
        },

        // SHOW IMAGE IN INPUT ADD FORM
        showImage() {
            const file = document.querySelector("input[type = file]").files[0];
            const reader = new FileReader();
            let img64 = "";
            reader.onloadend = () => {
                img64 = reader.result;
                this.img = img64;
            }
            reader.readAsDataURL(file);
        },

        // AFFICHER LA FORMULAIRE AJOUTER DE MATERIEL
        showAddForm() {
            this.clearForm();
            this.active = true;
            this.legend = "Ajout de materiel"; 
        },

        // AFFICHER LA FORMULAIRE MODIFIER DE MATERIEL
        showEditForm() {
            this.active = true;
            this.legend = "Modifier un materiel";
            this.clearForm();
            
            for(let i = 0;  i < this.materiel.length; i++){
                if(this.materiel[i].numSerie == this.numSerieTemp){
                    this.img = this.materiel[i].image;
                    this.numSerie = this.materiel[i].numSerie;
                    this.nom = this.materiel[i].nomMateriel;
                    this.marque = this.materiel[i].marque;
                    this.etat = this.materiel[i].etat;
                    this.prix= this.materiel[i].prix;
                    this.occupation= this.materiel[i].occupation;
                    break;
                }
            }
        },

        // ENVOYER UNE REQUETE VERS LA BASE DE DONNEES (CREATE) 
        addMateriel() {
            const file = document.querySelector("input[type = file]").files[0];
            const reader = new FileReader();
            let img64 = "";
            reader.onloadend = () => {
                img64 = reader.result;
                var data = {
                    "numSerie": this.numSerie,
                    "nomMateriel": this.nom,
                    "marque": this.marque,
                    "etat":	this.etat,
                    "prix":	this.prix,
                    "occupation": this.occupation,
                    "image": btoa(img64)
                }
                var data2 = {
                    "numSerie": this.numSerie,
                    "nomMateriel": this.nom,
                    "marque": this.marque,
                    "etat":	this.etat,
                    "prix":	this.prix,
                    "occupation": this.occupation,
                    "image": img64
                }
                
                axios.post("https://techinnova-latest.onrender.com/techinnova/api/materiel/addMateriel", data)
                .then(response => console.log(response))
                .catch(error => console.log(error))

                this.materiel.push(data2);
                this.clearForm();
                alert("Ajout avec succès");
                this.cancel();
            }
            reader.readAsDataURL(file);
        },

        // ENVOYER UNE REQUETE VERS LA BASE DE DONNEES (UPDATE) 
        editMateriel() {
            const file = document.querySelector("input[type = file]").files[0];
            if(file == null) {
                var img = "";
                for(let i = 0;  i < this.materiel.length; i++){
                    if(this.materiel[i].numSerie == this.numSerie){
                        img = this.materiel[i].image;
                        break;
                    }
                }
                var data = {
                    "numSerie": this.numSerie,
                    "nomMateriel": this.nom,
                    "marque": this.marque,
                    "etat":	this.etat,
                    "prix":	this.prix,
                    "occupation": this.occupation,
                    "image": btoa(img)
                }
            
                axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMateriel/"+ this.numSerie, data)
                .then(response => console.log(response))
                .catch(error => console.log(error))
                
                for(let i = 0; i < this.materiel.length; i++) {
                    if(this.materiel[i].numSerie == this.numSerie) {
                        this.materiel[i].nomMateriel = this.nom;
                        this.materiel[i].marque = this.marque;
                        this.materiel[i].etat = this.etat;
                        this.materiel[i].occupation = this.occupation;
                        this.materiel[i].prix = this.prix;
                        this.materiel[i].image = img;
                        
                        break;
                    }
                }

                this.search = "";
                this.clearForm();
                this.cancel();
            } else {
                const reader = new FileReader();
                var img64 = "";
                reader.onloadend = () => {
                    img64 = reader.result;
                    var data = {
                        "numSerie": this.numSerie,
                        "nomMateriel": this.nom,
                        "marque": this.marque,
                        "etat":	this.etat,
                        "prix":	this.prix,
                        "occupation": this.occupation,
                        "image": btoa(img64)
                    }
                
                    axios.put("https://techinnova-latest.onrender.com/techinnova/api/materiel/updateMateriel/"+ this.numSerie, data)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                    
                    for(let i = 0; i < this.materiel.length; i++) {
                        if(this.materiel[i].numSerie == this.numSerie) {
                            this.materiel[i].nomMateriel = this.nom;
                            this.materiel[i].marque = this.marque;
                            this.materiel[i].etat = this.etat;
                            this.materiel[i].occupation = this.occupation;
                            this.materiel[i].prix = this.prix;
                            this.materiel[i].image = img64;
                            
                            break;
                        }
                    }

                    this.search = "";
                    this.clearForm();
                    this.cancel();                 
                }
                reader.readAsDataURL(file);
            }
        },

        // ENVOYER UNE REQUETE VERS LA BASE DE DONNEES (DELETE) 
        remove() {
            if(confirm("Voulez-vous supprimer")) {
                axios.delete("https://techinnova-latest.onrender.com/techinnova/api/materiel/deleteMateriel/" + this.numSerieTemp)
                .then(response => console.log(response))
                .catch(error => console.log(error))
                for(let i = 0; i < this.materiel.length; i++){
                    if(this.numSerieTemp == this.materiel[i].numSerie) {
                        for(let j = i; j < this.materiel.length; j++) {
                            this.materiel[j] = this.materiel[j + 1];
                        }
                        this.materiel.pop();
                        break;
                    }
                }
            }
        },

        // CACHER LA FORMULAIRE LORSQU'ON CLIQUE SUR LE BTN CANCEL
        cancel() {
            this.active = false;
        },

        // AFFICHER LA FORMULAIRE DE MISE A JOUR (MODIFICATION)
        edit() {
            this.active = true;
        }
    },
    created() {
        this.getMateriel();

        setInterval(() => {
            this.getMateriel();
        }, 1500);
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
    :disabled{
        opacity: 0.4;
    }
    input[name='numSerie']:read-only{
        outline: none;
        border: 2px solid $co1;
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
        .box{
            display: flex;
            align-items: center;
            justify-content: start;
            flex-wrap: wrap;
            .box-content{
                border: 1px solid rgba($color: $co2, $alpha: 0.6);
                width: 250px;
                height: auto;
                list-style: none;
                padding: 10px;
                margin: 10px;
                font-size: 0.9em;
                border-radius: 3px;
                color: #ffffff;
                background-color: #002233;
                box-shadow: 1px 1px 4px rgba($color: $co2, $alpha: 0.2), -1px 1px 4px rgba($color: $co2, $alpha: 0.2);
                .img{
                    width: 100%;
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
                .check-box{
                    border: 1p solid $co3;
                    border-radius: 20px;
                    background-color: $co3;
                }
                .check-box:checked{
                    background-color: #4120ff !important;
                }
                .unique-check-box2{
                    background-color: red;
                    animation-duration: 0.5s;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    animation-name: xxx;
                }
                @keyframes xxx {
                    0%{
                        margin-top: 0px;
                    }
                    50%{
                        margin-top: 18px;
                    }
                    100%{
                        margin-top: 20px;
                    }
                }
            }
        }
        @media screen and(max-width: 1366px) {
            .box{
                .box-content{
                    flex-basis: 23.1%;
                }
            }
        }
        @media screen and(max-width: 1200px) {
            .box{
                .box-content{
                    flex-basis: 31%;
                }
            }
        }
        @media screen and(max-width: 992px) {
            .box{
                .box-content{
                    flex-basis: 46%;
                }
            }
        }
        @media screen and(max-width: 550px) {
            .box{
                .box-content{
                    flex-basis: 100%;
                }
            }
        }
        
    }
    
    .add-edit{
        margin-top: 15%;
        display: flex;
        align-items: center;
        justify-content: center;
        .form{
            width: 400px;
            background-color: #d3d3d3;
            padding: 16px;
            transition: all 0.2s;
            .form-control{
                padding: 8px;
                margin: 8px 0px;
            }
            .btn-groupr{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .btn{
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
