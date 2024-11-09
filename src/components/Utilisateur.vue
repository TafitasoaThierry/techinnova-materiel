<template>
    <div class="container">
        <div class="field">
            <div class="add-field">
                <a href="#add"><button class="btn btn-primary add-btn" v-on:click="showAddForm()">Ajouter</button></a>
            </div>
            <div class="search-field">
                <input type="text" placeholder="IM, nom, prenoms" class="search-input">
                <button class="search-btn"><i class="fa-solid fa-search"></i></button>
            </div>
        </div>
        <div class="table table-striped table-hover table-condensed">
            <table class="table">
                <thead>
                    <tr>
                        <th>Immatricule</th>
                        <th>Nom</th>
                        <th>Prenoms</th>
                        <th>Tel</th>
                        <th>Adresse</th>
                        <th>Type</th>
                        <th colspan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="utilisateur in utilisateur" v-bind:key="utilisateur.immatricule">
                        <td>{{ utilisateur.immatricule }}</td>
                        <td>{{ utilisateur.nom }}</td>
                        <td>{{ utilisateur.prenoms }}</td>
                        <td>{{ utilisateur.tel }}</td>
                        <td>{{ utilisateur.adresse }}</td>
                        <td>{{ utilisateur.typeUtilisateur }}</td>
                        <td><a href="#add"><button class="edit-btn btn" @click="showEditForm(immatriculeTemp = utilisateur.immatricule);"><i class="fa-solid fa-edit"></i></button></a></td>
                        <td><button class="remove-btn btn" @click="remove(immatriculeTemp = utilisateur.immatricule);"><i class="fa-solid fa-remove"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="add-edit" v-show="active" id="add" style="margin-bottom: 5%;">
        <div class="form">
            <form>
                <legend style="text-align: center;">{{ legend }}</legend>
                <div class="form-group">
                    <label>Immatricule</label><br>
                    <input type="text" placeholder="Immatricule" name="immatricule" class="form-control" @keyup="checkIM()" :readonly="legend=='Modifier un utilisateur'" v-model="immatricule">
                    <p><small style="color: red;" v-if="imExist">Immatricule déjà prise</small></p>
                </div>
                <div class="form-group">
                    <label>Nom</label><br>
                    <input type="text" placeholder="Nom" class="form-control" v-model="nom">
                </div>
                <div class="form-group">
                    <label>Prenoms</label><br>
                    <input type="text" placeholder="Prenoms" class="form-control" v-model="prenoms">
                </div>
                <div class="form-group">
                    <label>Adresse</label><br>
                    <input type="text" placeholder="Adresse" class="form-control" v-model="adrs">
                </div>
                <div class="form-group">
                    <label>Téléphone</label><br>
                    <input type="text" placeholder="Téléphone" class="form-control" v-model="tel">
                </div>
                <div class="form-group">
                    <label>Type</label><br>
                    <select name="userType" id="userType" class="form-control" v-model="type" v-on:change="showPwdForAdmin(); pwd=''; pwdConf='';">
                        <option selected>Simple</option>
                        <option value="Responsable" v-show="typeFromDB == 'SuperUtilisateur'">Responsable</option>
                        <option value="SuperUtilisateur" v-show="typeFromDB == 'SuperUtilisateur'">SuperUtilisateur</option>
                    </select>
                </div>
                <div class="form-group" v-show="pwdForAdmin">
                    <label>Mots de passe</label><br>
                    <input type="password" placeholder="Mots de passe" class="form-control" @keyup="checkPwd()" v-model="pwd">
                </div>
                <div class="form-group" v-show="pwdForAdmin">
                    <label>Confirmer</label><br>
                    <input type="password" placeholder="Confirmer" class="form-control" @keyup="checkPwd()" v-model="pwdConf">
                    <p><small style="color: red;" v-if="pwd != pwdConf && pwdConf.length>0">Erreur de la confirmation</small></p>
                </div>
            </form>                
            <div class="btn-groupr btn-group-lg">
                <button class="btn btn-warning add-btn" v-on:click="addUser()" :disabled="((legend != 'Ajout d\'utilisateur') || (immatricule == '') || (imExist == true) || (nom == '') || (prenoms == '') || (adrs == '') || (tel == '') || ((type == 'Responsable') || (type == 'SuperUtilisateur')) && (pwdChecked == false))"><i class="fa-solid fa-add"></i> Ajouter</button>
                <button class="btn btn-success edit-btn" v-on:click="editUser()" :disabled="((legend != 'Modifier un utilisateur') || (nom == '') || (prenoms == '') || (adrs == '') || (tel == ''))"><i class="fa-solid fa-edit"></i> Modifier</button>
                <button class="btn btn-primary" v-on:click="cancel()"><i class="fa-solid fa-remove"></i> Annuler</button>
            </div>
        </div> 
    </div>
</template>

<script>
import axios from 'axios';
import { url } from './point';

export default {
    name: "UtilisateurComponent",
    data() {
        return{
            utilisateur: [],
            immatriculeTemp: "",
            immatricule: "",
            nom: "",
            prenoms: "",
            adrs: "",
            tel: "",
            type: "Simple",
            pwd: "",
            pwdConf: "",
            pwdChecked: false,
            imExist: false,

            legend: "",
            data: "",
            active: false, // show-hide controler
            disabled: true,
            pwdForAdmin: false,
            showWarning: false,
            typeFromDB: ""
        };
    },
    methods: {
        // check IM if exist onkeyup
        checkIM() {
            for(let i = 0; i < this.utilisateur.length; i++) {
                if(this.immatricule == this.utilisateur[i].immatricule){
                    this.imExist = true;
                    break;
                }else{
                    this.imExist = false;
                }
            }
        },

        // check passwd
        checkPwd() {
            this.pwd == this.pwdConf && this.pwd != '' && this.pwdConf != '' ? this.pwdChecked = true : this.pwdChecked = false;
        },

        // read materiel from DB
        getUtilisateur() {
            axios.get(url() + "techinnova/api/utilisateur/get/" + document.cookie)
            .then( (user) => {
                if(user.data != null) {
                this.typeFromDB = user.data.typeUtilisateur
                    axios.get(url() + "techinnova/api/utilisateur/getUtilisateur")
                    .then((response) => {
                        this.utilisateur = [];
                        if(this.typeFromDB == "SuperUtilisateur") {
                            for(let i = 0; i < response.data.length; i++) {
                                if(response.data[i].typeUtilisateur != "SuperUtilisateur") {
                                    this.utilisateur.push(response.data[i]);
                                }
                            }
                        }else{ 
                            for(let i = 0; i < response.data.length; i++) {
                                if(response.data[i].typeUtilisateur == "Simple") {
                                    this.utilisateur.push(response.data[i]);
                                }
                            }
                        }
                    })
                    .catch(error => console.log(error))
                }
            })
            .catch((error) => (console.log(error)))
        },        

        // CLEAR FORM
        clearForm() {
            this.immatricule = "";
            this.nom = "";
            this.prenoms = "";
            this.adrs = "";
            this.tel = "";
            this.type = "Simple";
            this.pwd = "";
            this.pwdConf = "";
            this.pwdForAdmin = false;
        },

        // show add utilisateur form
        showAddForm() {
            this.clearForm();
            this.active = true;
            this.legend = "Ajout d'utilisateur"; 
        },

        // show edit utilisateur form
        showEditForm() {
            this.active = true;
            this.legend = "Modifier un utilisateur";
            this.clearForm();
            for(let i = 0;  i < this.utilisateur.length; i++){
                if(this.utilisateur[i].immatricule == this.immatriculeTemp){
                    this.immatricule = this.immatriculeTemp;
                    this.nom = this.utilisateur[i].nom;
                    this.prenoms = this.utilisateur[i].prenoms;
                    this.adrs = this.utilisateur[i].adresse;
                    this.tel = this.utilisateur[i].tel;
                    this.type= this.utilisateur[i].typeUtilisateur;
                    break;
                }
            }
        },

        // show passwd field for admin/responsable
        showPwdForAdmin() {
            if(this.type == "Responsable" || this.type == "SuperUtilisateur" && this.legend != "Modifier un utilisateur"){
                this.pwdForAdmin = true;
            }else{
                this.pwdForAdmin = false;
            }
        },

        // cancel add or edit form
        cancel() {
            this.active = false;
        },

        // valid add utilisateur form and send request
        addUser() {
            var data = {
                "immatricule": this.immatricule,
                "tel": this.tel,
                "nom": this.nom,
                "prenoms": this.prenoms,
                "adresse": this.adrs,
                "typeUtilisateur": this.type,
                "mdp": this.pwd
            }
            axios.post(url() + "techinnova/api/utilisateur/createUtilisateur", data)
            .then(response => console.log(response))
            .catch(error => console.log(error))

            this.utilisateur.push(data);
            this.clearForm();
            this.cancel();
        },

        // valid edit utilisateur form and send request
        editUser() {
            var data = {
                "immatricule": this.immatricule,
                "tel": this.tel,
                "nom": this.nom,
                "prenoms": this.prenoms,
                "adresse": this.adrs,
                "typeUtilisateur": this.type,
                "mdp": function(){
                    if(this.mdp == "Admin/Responsable"){
                        return this.mdp;
                    }else{
                        return "nope";
                    }
                }
            }
            
            axios.put(url() + "techinnova/api/utilisateur/updateUtilisateur/"+ this.immatricule, data)
            .then(response => console.log(response))
            .catch(error => console.log(error))

            for(let i = 0; i < this.utilisateur.length; i++) {
                if(this.utilisateur[i].immatricule == this.immatricule) {
                    this.utilisateur[i].nom = this.nom;
                    this.utilisateur[i].prenoms = this.prenoms;
                    this.utilisateur[i].adresse = this.adrs;
                    this.utilisateur[i].tel = this.tel;
                    this.utilisateur[i].typeUtilisateur = this.type;
                    this.type == "Responsable" || this.type == "Direction" ? this.utilisateur[i].mdp = this.mdp : this.utilisateur[i].mdp = "nope";

                    break;
                }
            }
            this.clearForm();
            this.cancel();
        },

        // send delete utilisateur request
        remove() {
            if(confirm("Voulez-vous supprimer")) {
                axios.delete(url() + "techinnova/api/utilisateur/deleteUtilisateur/" + this.immatriculeTemp)
                .then(response => console.log(response))
                .catch(error => console.log(error))
                for(let i = 0; i < this.utilisateur.length; i++) {
                    if(this.utilisateur[i].immatricule == this.immatriculeTemp) {
                        for(let j = i; j < this.utilisateur.length; j++) {
                            this.utilisateur[j] = this.utilisateur[j+1];
                        }
                        this.utilisateur.pop();
                        break;
                    }
                }
            }
        },
    },

    // HOOKS
    created() {
        this.getUtilisateur();
        
        setInterval(() => {
            this.getUtilisateur();
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
    input[name='immatricule']:read-only{
        outline: none;
        border: 2px solid $co1;
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
        }
    }
</style>