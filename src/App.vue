<template>
  <div class="header">
    <div class="logo-field">
      <img class="logo" src="./assets/TECHINOVA.png" alt="TECHINOVA" />
    </div>
    <div class="nav" v-show="activeNav">
      <li class="menu"><router-link class="menu-bar" to="/">Materiel</router-link></li>
      <li class="menu"><router-link class="menu-bar" to="/entreeSortie">Entrées-Sortie</router-link></li>
      <li class="menu"><router-link class="menu-bar" to="/utilisateur">Utilisateur</router-link></li>
      <li class="menu"><button class="sign-btn" @click="deconnecter()">Se déconnecter</button></li>
    </div>
    <div class="dd">
      <button class="btn btn-primary displayBtn"><i class="fa-solid fa-list"></i></button>
      <div class="display-menu">
        <li class="menu2"><router-link class="menu-bar2" to="/">Materiel</router-link></li>
        <li class="menu2"><router-link class="menu-bar2" to="/entreeSortie">Entrées-Sortie</router-link></li>
        <li class="menu2"><router-link class="menu-bar2" to="/utilisateur">Utilisateur</router-link></li>
        <li class="menu2"><button class="sign-btn2" @click="deconnecter()">Se déconnecter</button></li>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top: 100px;">
    <Login v-show="loginForm" v-on:activationEnable="activate"/>
    <div v-show="activeContent">
      <div class="login-info" v-show="activeLoginInfo" style="color: #ffffff;">
        <div class="mini-box"><p><i class="fa-solid fa-key"></i> {{ idLog }}  <i class="fa-solid fa-user"></i> {{ nomLog }} {{ prenomsLog }}</p></div>
        <div class="mini-box"><button class="btn-edit-info" @click="showEditForm()"><i class="fa-solid fa-edit"></i></button></div>
      </div>
      <div class="add-edit" v-show="edit">
        <div class="form">
            <legend style="text-align: center;">Mise à jours</legend>
            <div class="form-group">
                <label>Immatricule</label><br>
                <input type="text" placeholder="Immatricule" name="immatricule" class="form-control" readonly v-model="id">
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
                <input type="text" placeholder="Adresse" class="form-control" v-model="adresse">
            </div>
            <div class="form-group">
                <label>Téléphone</label><br>
                <input type="text" placeholder="Téléphone" class="form-control" v-model="tel">
            </div>
            <div class="form-group">
              <button class="show-edit-pwd" style="padding: 8px; outline: none; border-radius: 3px; border: 1px solid rgb(172, 172, 172);" @click="showEditPwd()">Changer de mots de passe</button>
            </div>
            <div class="form-group" v-show="pwdForAdmin">
                <label>Ancien mots de passe</label><br>
                <input type="password" placeholder="Ancien mots de passe" class="form-control" v-model="oldPwd">
                <p v-if="mdp != oldPwd && oldPwd.length > 0" style="color: red;" ><small>Mots de passe incorrect</small></p>
            </div>
            <div class="form-group" v-show="pwdForAdmin">
                <label>Nouveau mots de passe</label><br>
                <input type="password" placeholder="Nouveau mots de passe" class="form-control" v-model="pwd">
            </div>
            <div class="form-group" v-show="pwdForAdmin">
                <label>Confirmer</label><br>
                <input type="password" placeholder="Confirmer" class="form-control" v-model="pwdConf">
                <p><small style="color: red;" v-if="pwd != pwdConf && pwdConf.length>0">Erreur de la confirmation</small></p>
            </div>                
        <div class="btn-groupr btn-group-lg yo">
            <!-- <button class="btn btn-message add-btn" id="control" v-on:click="deleteUser()" :disabled="((nom == '') || (prenoms == '') || (adresse == '') || (tel == ''))"><i class="fa-solid fa-remove"></i> Supprimer</button> -->
            <button class="btn btn-success edit-btn" style="width: 180px;" id="control" v-on:click="editUser()" :disabled="((nom == '') || (prenoms == '') || (adresse == '') || (tel == ''))"><i class="fa-solid fa-edit"></i> Modifier</button>
            <button class="btn btn-success" style="width: 180px; background-color: transparent; color: rgb(20, 143, 20);" id="control" v-on:click="cancel()"><i class="fa-solid fa-remove"></i> Annuler</button>
        </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
  
</template>

<script>
import "./styles/bootstrap-4.0.0-dist/bootstrap.min.css";
import "./styles/fontawesome-6.6.0-web/css/all.min.css";
import Login from "./components/Login.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Login
  },
  data(){
    return{
      nomLog: "",
      prenomsLog: "",
      idLog: "",

      nom: "",
      prenoms: "",
      id: "",
      adresse: "",
      tel: "",
      mdp: "",
      type: "",

      activeLoginInfo: false,
      activeNav: false,
      activeContent: false,
      loginForm: true,
      edit: false,

      // manage change pwd
      pwdForAdmin: false,
      oldPwd: "",
      pwd: "",
      pwdConf: "",
      allowChangePwd: false,

      displayMenu: false
    };
  },
  created() {
    setInterval(() => {
      this.checkCookie();
    }, 1000)
  },
  methods: {
    setDisplayMenu() {

    },
    showEditPwd() {
      this.pwdForAdmin = (this.pwdForAdmin == false) ? true : false;
      this.allowChangePwd = (this.allowChangePwd == false) ? true : false;
    },
    showEditForm() {
      this.edit = true;

      axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/get/" + document.cookie)
        .then( (response) => {
          this.nom = response.data.nom;
          this.prenoms = response.data.prenoms;
          this.id = response.data.immatricule;
          this.adresse = response.data.adresse;
          this.tel = response.data.tel;
          this.mdp = response.data.mdp;
          this.type = response.data.typeUtilisateur
        })
        .catch((error) => (console.log(error)))
    },
    editUser() {
        if(this.allowChangePwd == true) {
          if((this.oldPwd == this.mdp) && (this.pwd == this.pwdConf) && (this.pwd.length > 0)) {
            const data = {
              "immatricule":	this.id,
              "tel": 	this.tel,
              "nom":	this.nom,
              "prenoms": this.prenoms,
              "adresse":	this.adresse,
              "typeUtilisateur": this.type,
              "mdp": this.pwd
            }
            
            if(confirm("Voulez-vous modifier ?")) {
              axios.put("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/updateUtilisateur/" + this.id, data)
              .then((response) => (console.log(response)))
              .then((error) => (console.log(error)))

              this.pwdForAdmin = false;
              this.allowChangePwd = false;
              this.oldPwd = "";
              this.pwd = "";
              this.pwdConf = "";
              this.edit = false;
            }
          }else{
            alert("Erreur de mots de passe !");
          }
          
        }else{
          const data = {
            "immatricule":	this.id,
            "tel": 	this.tel,
            "nom":	this.nom,
            "prenoms": this.prenoms,
            "adresse":	this.adresse,
            "typeUtilisateur": this.type,
            "mdp": this.mdp
          }
          if(confirm("Voulez-vous modifier ?")) {
            axios.put("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/updateUtilisateur/" + this.id, data)
            .then((response) => (console.log(response)))
            .then((error) => (console.log(error)))

            this.pwdForAdmin = false;
            this.allowChangePwd = false;
            this.oldPwd = "";
            this.pwd = "";
            this.pwdConf = "";
            this.edit = false;
          }
        }
    },
    cancel() {
      this.edit = false
    },
    deconnecter() {
      if(confirm("Voulez-vous deconnecter")) {
        document.cookie = "null";
        this.activeLoginInfo = false;
        this.activeNav = false;
        this.activeContent = false;
        this.loginForm = true;

        this.pwdForAdmin = false;
        this.allowChangePwd = false;
        this.oldPwd = "";
        this.pwd = "";
        this.pwdConf = "";
      }
    },
    checkCookie() {
      //console.log("document.cookie = " + document.cookie);
      if(document.cookie != "" && document.cookie != "null") {
        this.activate();
      }
    },
    activate() {
      if(document.cookie != "" && document.cookie != "null") {
        let id = document.cookie;
        this.loginForm = false;
        this.activeLoginInfo = true;
        this.activeNav = true;
        this.activeContent = true;
        axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/get/" + id)
        .then( (response) => {
          this.nomLog = response.data.nom;
          this.prenomsLog = response.data.prenoms;
          this.idLog = response.data.immatricule;
          this.mdp = response.data.mdp;

          document.cookie = this.idLog;
        })
        .catch((error) => (console.log(error)))
      }else{
        this.loginForm = false;
        this.activeLoginInfo = true;
        this.activeNav = true;
        this.activeContent = true;
        axios.get("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/get/" + this.$store.state.loginId)
        .then( (response) => {
          this.nom = response.data.nom;
          this.prenoms = response.data.prenoms;
          this.id = response.data.immatricule;
          document.cookie = this.id;
          //console.log("Data = " + response.data)
        })
        .catch((error) => (console.log(error)))
      }
    },
  },
};
</script>

<style lang="scss">
  @font-face {
      font-family: Nunito;
      src: url("./styles/font/Nunito-SemiBold.ttf");
  }
  @font-face {
      font-family: Poppins;
      src: url("./styles/font/Poppins-Regular.ttf");
  }
  $co1: #FFFF00;
  $co2: #595959;
  $co3: #808080;
  $logo-wd: 180px;

  *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  body{
    background-image: url("./assets/blob.png");
    background-size: cover;
  }
  .add-edit{
    margin-top: 8%;
    margin-bottom: 10%;
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
        }
        .btn-groupr{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .btn{
                border-radius: 6px;
                font-size: 1em;
            }
        }
    }
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
  .login-info{
    display: flex;
    align-items: center;
    border: 1px solid $co3;
    border-radius: 3px;
    margin: 8px 0px;
    justify-content: space-between;
    .mini-box{
      padding: 8px 16px;
      align-items: center;
      .btn-edit-info{
        outline: none;
        background-color: transparent;
        padding: 8px 10px;
        border: 1px solid $co2;
        border-radius: 3px;
        color: #ffffff;
      }
    }
  }
  .header{
      background-color: $co1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      width: 100%;
      box-shadow: 3px 2px 4px rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0%;
      left: 0%;
      right: 0;

      .logo-field{
          .logo{
              width: $logo-wd;
              height: auto;
          }
      }
      .nav{
          align-items: center;
          
          .menu{
              list-style: none;
              display: inline;
              padding: 8px;
              font-size: 1rem;
              font-family: font;
          }
          .menu-bar{
              color: $co2;
              font-family: Nunito;
              text-decoration: none;
          }
          .router-link-exact-active{
              color: #000000;
          }
          .sign-btn{
              outline: none;
              border: none;
              border-radius: 3px;
              background-color: $co2;
              color: #ffffff;
              padding: 8px;
              font-size: 14px;
              transition: all 0.2s ease-in-out;
              font-family: Nunito;
          }
          .sign-btn:hover{
              background-color: $co3;
          }
      }
  }
  .dd{
    display: none;
  }
  .btn-display-menu{
      border: none;
      border-radius: 3px;
      background-color: $co2;
      padding: 0 8px;
      color: #ffffff;
      font-size: 25px;
      transition: all 0.2s ease-in-out;
  }
  .btn-display-menu:hover{
      background-color: $co3;
  }
  @media screen and(max-width: 720px) {
      .nav{
          display: none;
      }
      .dd{
          position: relative;
          display: inline-block;
      }
      .menu2{
        color: black;
        font-family: Nunito;
        padding: 5px 3px;

        .router-link-exact-active{
            color: #000000;
        }
        .sign-btn2{
          outline: none;
          background-color: $co2;
          border: none;
          padding: 8px;
          color: #ffffff;
          border-radius: 3px;
        }
        .menu-bar2{
          color: $co2;
        }
      }
      .display-menu{
          display: none;
          position: absolute;
          list-style: none;
          right: 0;
          top: 5%;
          width: 155px;
          height: 200px;
          padding: 10px;
          background-color: #ffffff;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), -3px 3px 6px rgba(0, 0, 0, 0.5);
      }
      .dd:hover > .display-menu{
        display: block;
      }
      @media screen and(max-width: 270px) {
          .header{
              display: none;
          }
      }
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
