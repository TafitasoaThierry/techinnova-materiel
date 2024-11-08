<template>
    <div class="login-container">
        <div class="form">
            <legend style="text-align: center; font-size: 35px; color: #ffff00;"><i class="fa-solid fa-lock" style="border: 1px solid #ffffff; padding: 18px 20px; border-radius: 60px;"></i></legend>
            <div class="form-group">
                <label for="id">Immatricule</label>
                <input type="text" name="id" class="form-control" v-model="id">
            </div>
            <div class="form-group">
                <label for="password">Mots de passe</label>
                <input type="password" name="password" class="form-control" v-model="passwd">
            </div>
            <div class="form-group">
                <button class="send" @click="checkLogin()" :disabled="((id == '') || (passwd == ''))">Se connecter</button>
            </div>
            <p style="color: red;"><small>{{ msg }}</small></p>
        </div>
    </div>
</template>

<script>
import "../styles/fontawesome-6.6.0-web/css/all.min.css";
import axios from "axios";

export default {
    name: "LoginComponent",
    data() {
        return {
            id: "",
            passwd: "",
            msg: "",
            activate: "NOT.OK"
        };
    },
    methods: {
        checkLogin() {
            const data = {
                "id": this.id,
                "pwd": this.passwd
            };
            axios.post("https://techinnova-latest.onrender.com/techinnova/api/utilisateur/getUtilisateurByImmatricule", data)
            .then((response) => {
                //console.log(response.data);
                switch(response.data) {
                    case 0: 
                        this.msg = "Erreur d'identification !";
                        break;
                    case 1: 
                        this.msg = "Mots de passe incorrecte !";
                        break;
                    case 2: 
                        this.msg = ""; 
                        this.$store.state.loginId = this.id;
                        this.id = "";
                        this.passwd = "";
                        this.$emit("activationEnable", "");
                        break;
                    case 3: 
                        this.msg = ""; 
                        this.$store.state.loginId = this.id;
                        this.id = "";
                        this.passwd = "";
                        this.$emit("activationEnable", "");
                        break;
                }
            })
            .catch(error => console.log(error))
        },
    },
};
</script>

<style lang="scss" scoped>
    @font-face {
        font-family: Nunito;
        src: url("../styles/font/Nunito-Regular.ttf");
    }
    $co1: #FFFF00;
    $co2: #595959;
    $co3: #808080;
    .login-container{
        font-family: Nunito !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20% ;
        .form{
            width: 380px;
            padding: 20px;
            border: 1px solid rgba($color: $co3, $alpha: 0.5);
            border-radius: 6px;
            label{
                color: #ffffff;
            }
            input{
                transition: all 0.2s;
            }
            .send{
                width: 100%;
                padding: 8px;
                border: none;
                outline: none;
                border-radius: 4px;
                background-color: $co1;
                transition: all 0.2s;
            }
            .send:hover, input:hover, input:focus{
                transform: scale(0.98);
            }
            :disabled{
                opacity: 0.6;
            }
        }
    }

</style>