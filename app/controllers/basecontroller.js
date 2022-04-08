
class BaseController {

    constructor() {
        this.setBackButtonView('index');
        this.title = document.getElementsByTagName("title")[0];
        this.navbarLinksWrapper = document.getElementsByClassName("navbar-nav")[0];

        this.loginModal = document.getElementById("login_modal");
        this.loginEmail = document.getElementById("loginemail");
        this.loginPassword = document.getElementById("loginpassword");
        this.loginSubmit = document.getElementById("loginSubmit");
        this.loginSubmit.onclick = () => this.loginSubmitHandler();
        this.loginResult = document.getElementById("loginResult");
        this.registerResult = document.getElementById("registerResult");
        this.modalloginclose = document.getElementById("modalloginclose");


        this.registerEmail = document.getElementById("registeremail");
        this.registerpassword = document.getElementById("registerpassword");
        this.registerfirstName = document.getElementById("registerfirstName");
        this.registerlastName = document.getElementById("registerlastName");
        this.registerbirthday = document.getElementById("registerbirthday");
        this.registerSubmit =document.getElementById("registerSubmit");

        this.modalregisterclose = document.getElementById("modalregisterclose");

        this.registerSubmit.onclick = () => this.registerSubmitHandler();

        this.mainSpinner = document.getElementById("main-spinner");
        this.loginSpinner = document.getElementById("login-spinner");
        this.registerSpinner = document.getElementById("register-spinner");
        this.resultLoginQuery = document.getElementById("resultLoginQuery")

        this.errorRegisterEmail = document.getElementById("error-register-email");
        this.errorRegisterPassword = document.getElementById("error-register-password");
        this.errorRegisterFirstName = document.getElementById("error-register-firstname");
        this.errorRegisterLastName = document.getElementById("error-register-lastname");
        this.errorRegisterBirthday = document.getElementById("error-register-birthday");

        this.errorLoginEmail = document.getElementById("error-login-email");
        this.errorLoginPassword = document.getElementById("error-login-password");
    }
    loginSubmitHandler() {
        let error = false;
        this.errorLoginEmail.innerText = "";
        this.errorLoginPassword.innerText = "";

        if(this.loginEmail.value.trim() === "") {
            error = true;
            this.errorLoginEmail.innerText = "Veuillez renseigner votre adresse email";
        }
        if(this.loginPassword.value === "") {
            error = true;
            this.errorLoginPassword.innerText = "Veuillez renseigner un mot de passe";

        }
        if(error) {
            return;
        }
        this.loginSpinner.classList.remove("hidden");
        User.login(this.loginEmail.value, this.loginPassword.value)
            .then(result => {
                this.loginSpinner.classList.add("hidden");

                this.loginEmail.value = "";
                this.loginPassword.value = "";
                this.loginResult.innerText = "";

                this.modalloginclose.click();
                LocalStorage.saveToken(result);
                navigate("person");
            })
            .catch(err => {

                this.loginSpinner.classList.add("hidden");
                if(err.status === 401) {
                    this.loginResult.innerText = "Adresse email ou mot de passe incorrect";
                } else if(err.status === 400) {
                    err.json()
                        .then(result => {
                            result.errors.forEach(error => {
                                if(error.param === "email") {
                                    this.errorLoginEmail.innerText = error.msg;
                                }
                                if(error.param === "password") {
                                    this.errorLoginPassword.innerText = error.msg;

                                }
                            })
                        });
                } else {
                    this.loginResult.innerText = "Une erreur est survenue," +
                        " veuillez réessayer ultérieurement";

                }
            })


    }
    registerSubmitHandler() {
        this.errorRegisterEmail.innerText = "";
        this.errorRegisterPassword.innerText = "";
        this.errorRegisterFirstName.innerText = "";
        this.errorRegisterLastName.innerText = "";
        this.errorRegisterBirthday.innerText = "";
        let erreur = false;
        if(this.registerEmail.value.trim() === "") {
            erreur = true;
            this.errorRegisterEmail.innerHTML += "Veuillez renseigner votre adresse email";
        }
        if(this.registerpassword.value.trim() === "") {
            erreur = true;
            this.errorRegisterPassword.innerHTML = "Veuillez renseigner un mot de passe"
        }
        if(this.registerpassword.value.trim().length < 8) {
            erreur = true;
            if(this.errorRegisterPassword.innerHTML.length !== 0) {
                this.errorRegisterPassword.innerHTML += "<br/>"
            }
            this.errorRegisterPassword.innerHTML += "Le mot de passe doit faire 8 caractères minimum";
        }
        if(this.registerfirstName.value.trim() === "") {
            erreur = true;
            this.errorRegisterFirstName.innerHTML = "Veuillez renseigner votre prénom";
        }
        if(this.registerlastName.value.trim() === "") {
            erreur = true;
            this.errorRegisterLastName.innerHTML = "Veuillez renseigner votre nom";
        }
        if(this.registerbirthday.value.trim() === "") {
            erreur = true;
            this.errorRegisterBirthday.innerHTML = "Veuillez renseigner votre date de naissance";
        }
        if(erreur) {
            return;
        }
        this.registerSpinner.classList.remove("hidden");
        User.register(this.registerfirstName.value, this.registerlastName.value,
            this.registerEmail.value, this.registerpassword.value, this.registerbirthday.value)
            .then(result => {
                this.registerSpinner.classList.add("hidden");

                this.toast("registerConfirm");
                this.modalregisterclose.click();
            }).catch((err) => {
            this.registerSpinner.classList.add("hidden");

            if(err.status === 400) {
                err.json()
                    .then(result=>{
                        result.errors.forEach(error => {
                            if(error.param === 'email') {
                                if(this.errorRegisterEmail.innerHTML.length !== 0) {
                                    this.errorRegisterEmail.innerHTML += "<br/>"
                                }
                                this.errorRegisterEmail.innerHTML += error.msg;
                            }
                            if(error.param === 'password') {
                                if(this.errorRegisterPassword.innerHTML.length !== 0) {
                                    this.errorRegisterPassword.innerHTML += "<br/>"
                                }
                                this.errorRegisterPassword.innerHTML += error.msg;
                            }
                            if(error.param === 'firstName') {
                                if(this.errorRegisterFirstName.innerHTML.length !== 0) {
                                    this.errorRegisterFirstName.innerHTML += "<br/>"
                                }
                                this.errorRegisterFirstName.innerHTML += error.msg;
                            }
                            if(error.param === 'lastName') {
                                if(this.errorRegisterLastName.innerHTML.length !== 0) {
                                    this.errorRegisterLastName.innerHTML += "<br/>"
                                }
                                this.errorRegisterLastName.innerHTML += error.msg;
                            }
                            if(error.param === 'birthday') {
                                if(this.errorRegisterBirthday.innerHTML.length !== 0) {
                                    this.errorRegisterBirthday.innerHTML += "<br/>"
                                }
                                this.errorRegisterBirthday.innerHTML += error.msg;
                            }
                        });
                    })
                }

            }) ;

    }
    toast(elemId) {
        const toast = new bootstrap.Toast(document.getElementById(elemId))
        toast.show()
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
    setNavbarLinks(links) {
        let text = "";
        let cpt = 0;
        for(let link of links) {
            cpt ++;
            if(cpt === links.length) {
                text += '<li class="nav-item last">';

            } else {
                text += '<li class="nav-item">';
            }
            if(link.active != undefined) {
                text += `
                    <a class="nav-link active" onclick="navigate('${link.view}')">${link.text}</a>
`;

            } else {
                text += `
                <a class="nav-link" onclick="navigate('${link.view}')">${link.text}</a>`;

            }
            text += '</li>';
        }
        this.isConnected()
            .then(result => {
                if(result.status === 204) {
                    text += `<li class="nav-item"><a class="nav-link active" onclick="window.baseController.disconnect();">Deconnexion</a></li>`;
                } else {
                    text += `<li class="nav-item"><a class="nav-link active" data-bs-toggle="modal" data-bs-target="#login_modal">Se connecter</a></li>`;
                    text += `<li class="nav-item"><a class="nav-link active" data-bs-toggle="modal" data-bs-target="#register_modal">Créer un compte</a></li>`;

                }
                this.navbarLinksWrapper.innerHTML = text;

            });

    }
    setTitle(title) {
        this.title.innerText = title;
    }
    toast(elemId) {
        const toast = new bootstrap.Toast(document.getElementById(elemId))
        toast.show()
    }
    disconnect() {
        LocalStorage.removeToken();
        navigate("index")
    }
    async isConnected() {
        return await Token.checkToken();
    }
    parseJwt (token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };
    showMainSpinner() {
        this.mainSpinner.classList.remove("hidden");
    }
    hideMainSpinner() {
        this.mainSpinner.classList.add("hidden");
    }
}
window.baseController = new BaseController()
