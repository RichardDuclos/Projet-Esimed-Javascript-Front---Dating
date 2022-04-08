class PersonController extends BaseController {
    constructor() {
        super()

        this.isConnected()
            .then(result => {
                if(result.status !== 204) {
                    navigate("index");
                } else {


             this.newPersonComment = document.getElementById("newPersonComment");

                    this.newPersonFirstName = document.getElementById("newPersonFirstName");
                    this.newPersonLastName = document.getElementById("newPersonLastName");
                    this.newPersonBirthday = document.getElementById("newPersonBirthday");

                    this.newPersonSubmit = document.getElementById("newPersonSubmit");
                    this.newPersonSubmit.onclick = () => this.newPersonHandler();

                    this.newPersonSpinner = document.getElementById("new-person-spinner");
                    this.newPersonConfirm = document.getElementById("newPersonConfirm");

                    this.newPersonGenderMan = document.getElementById("newPersonGenderMan");
                    this.newPersonGenderWoman = document.getElementById("newPersonGenderWoman");
                    this.newPersonGenderOther = document.getElementById("newPersonGenderOther");
                    this.newCommentPersonId = document.getElementById("newCommentPersonId");
                    this.newCommentText = document.getElementById("newCommentText");
                    this.openModalComment = document.getElementById("openModalComment");
                    this.newCommentSubmit = document.getElementById("newCommentSubmit");
                    this.modalnewcommentclose = document.getElementById("modalnewcommentclose");
                    this.newCommentSpinner = document.getElementById("new-comment-spinner");
                    this.errorNewComment = document.getElementById("error-new-comment");

                    this.modalConfirmSubmit = document.getElementById("modalConfirmSubmit");

                    this.errorNewPersonFirstName = document.getElementById("error-new-person-firstname");
                    this.errorNewPersonLastName = document.getElementById("error-new-person-lastname");
                    this.errorNewPersonGender = document.getElementById("error-new-person-gender");
                    this.errorNewPersonBirthday = document.getElementById("error-new-person-birthday");
                    this.errorNewPersonComment = document.getElementById("error-new-person-comment");

                    this.openModalConfirmDelete = document.getElementById("openModalConfirmDelete");
                    this.modalConfirmClose = document.getElementById("modalConfirmClose");
                    this.confirmDeletePersonId = document.getElementById("confirmDeletePersonId");
                    this.confirmDeleteTitle = document.getElementById("confirmDeleteTitle");
                    this.datesWrapper = document.getElementById("dates-wrapper");
                    this.root = document.getElementById("root");
                    this.root.classList.remove("hidden")
                    this.setTitle("Dating meet");
                    let home = {
                        text : "Accueil",
                        view : "index",
                        active : true
                    }
                    let date = {
                        text : "Rendez vous",
                        view : "date"
                    }
                    let links = [home, date];
                    this.setNavbarLinks(links);
                    const token = this.parseJwt(LocalStorage.getToken());
                    const id = token.id;
                    User.getUser(id, LocalStorage.getToken())
                        .then(result => {
                            this.user = result;
                            this.bienvenuediv = document.getElementById("bienvenue");
                            this.bienvenuediv.innerText = `Bienvenue ${this.user.firstName}`;
                            this.displayPerson();
                        });

                }
            });
    }

    async newPersonHandler() {
        this.errorNewPersonFirstName.innerText = "";
        this.errorNewPersonLastName.innerText = "";
        this.errorNewPersonGender.innerHTML = "";
        this.errorNewPersonBirthday.innerText = "";
        let error = false;
        if(this.newPersonFirstName.value.trim() === "") {
            error = true;
            this.errorNewPersonFirstName.innerText = "Veuillez saisir un prénom";
        }
        if(this.newPersonLastName.value.trim() === "") {
            error = true;
            this.errorNewPersonLastName.innerText = "Veuillez saisir un nom";

        }
        if(this.newPersonBirthday.value.trim() === "") {
            error = true;
            this.errorNewPersonBirthday.innerText = "Veuillez saisir une date d'anniversaire";

        }
        if(error) {
            return
        }
        this.newPersonSpinner.classList.remove("hidden");
        this.newPersonConfirm.innerText = "";
        let gender = "";
        if(this.newPersonGenderMan.checked) {
            gender = "M";
        } else if(this.newPersonGenderWoman.checked) {
            gender = "W";
        } else if(this.newPersonGenderOther.checked) {
            gender = "O";
        } else {
            return;
        }
        let person = new Person(
            null,
            this.newPersonFirstName.value,
            this.newPersonLastName.value,
            gender,
            this.newPersonBirthday.value,
            this.newPersonComment.value
        );


        this.user.addPerson(person,  LocalStorage.getToken())
            .then(result => {
                this.newPersonSpinner.classList.add("hidden");

                this.newPersonFirstName.value = "";
                this.newPersonLastName.value = "";
                this.newPersonBirthday.value = "";
                this.newPersonComment.value = "";
                this.newPersonConfirm.innerText = "La personne à bien été ajouté";
                this.displayPerson();


            })
            .catch(err => {

                this.newPersonSpinner.classList.add("hidden");
                if(err.status === 400) {
                    err.json()
                        .then(result => {
                            result.errors.forEach(error => {
                                if(error.param === "firstName") {
                                    this.errorNewPersonFirstName.innerText = error.msg;
                                }
                                if(error.param === "lastName") {
                                    this.errorNewPersonLastName.innerText = error.msg;
                                }
                                if(error.param === "gender") {
                                    if(this.errorNewPersonGender.innerHTML.length !== "") {
                                        this.errorNewPersonGender.innerHTML += "<br/>";
                                    }
                                    this.errorNewPersonGender.innerHTML = error.msg
                                } if(error.param === "birthday") {
                                    this.errorNewPersonBirthday.innerText = error.msg
                                }

                            })
                        });
                }

            })
    }
    async newCommentHandler(personId) {
        if(this.newCommentText.value.length > 500) {
            this.errorNewComment.innerText = "Votre commentaire doit faire 500 caractères ou moins";
            return;
        }
        this.errorNewComment.innerText = "";
        this.newCommentSpinner.classList.remove("hidden");
        this.user.editComment(personId, this.newCommentText.value, LocalStorage.getToken())
            .then(result => {
                this.newCommentSpinner.classList.add("hidden");

                this.displayPerson().then(() => {
                    this.modalnewcommentclose.click();

                })
            })
            .catch(err => {
                this.newCommentSpinner.classList.add("hidden");
                if(err.status === 400) {
                    err.json()
                        .then(result => {
                            let first = true;
                            let text = "";
                            result.errors.forEach(error => {
                                if(first) {
                                   first = false;
                                } else {
                                    text += "<br/>";
                                }
                                text += error.msg;
                            })
                            this.errorNewComment.innerHTML = text;
                        })
                }

            });
    }

    async displayPerson() {
        this.showMainSpinner()
        const array = await this.user.getPersons(LocalStorage.getToken())
            .then(response => {
                let text = "";
                if(response.length === 0) {
                    text += this.getNoPersonHTML();
                }
                response.forEach(u => {
                    text+= this.getPersonHTML(u.id, u.firstName, u.lastName, u.gender, u.birthday, u.comment, );
                });

                this.hideMainSpinner()
                this.datesWrapper.innerHTML = text;

            });
    }
    getNoPersonHTML() {
        return `Vous n'avez pas encore ajouté de personnes à votre liste.
        Appuyez sur 
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path fill="blueviolet" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
        </svg> pour commencer l'aventure.
`;
    }
    getPersonHTML(id, firstName, lastName, gender, birthday, comment) {
        if(gender === "M") {
            gender = "Homme";
        } else if(gender==="W") {
            gender = "Femme";
        } else {
            gender = "Autre";
        }
        let text = `
            <div class="card person-card">
                <button class="icon-button person-trash" onclick="window.personController.disownRequest('${id}')"  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path fill="red" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </button>
                <div class="card-title person-card-title">
                    ${firstName} ${lastName} 
                </div>
                <div class="card-body ">
                    
                    <div class="container"> 
                            <div class="row person-gender-row">
                                <div class="gender">
                                    ${gender}
                                </div>                                
                            </div>
                         <div class="row comment-content">
                            `;
            if(comment !== null) {
                text += comment;
            } else {
                text+= `Vous n'avez pas commenté cette personne`;
            }
            text += `
                        </div>
                        <div>
                        <button class="button editPersonCommentButton"
                        `;
            text += ` onclick="`;
            let tempComm = encodeURIComponent(comment);
            tempComm = tempComm.replace(/'/g, "%27");

            if(comment === null) {
                text += `window.personController.newComment('${id}');`
            } else {
                text += `window.personController.editComment('${id}', '${tempComm}');`
            }
            text += `">`;
            if(comment === null) {
                text += "Ecrire un commentaire";
            } else {
                text += "Modifier le commentaire";
            }

            text += `
                        </button>
                        </div>
                    </div>
                
                </div>
            </div>
        
        `;
        return text;

    }

    newComment(person_id) {
        this.newCommentSubmit.onclick = () => this.newCommentHandler(person_id);

        this.newCommentText.value = "";
        this.newCommentSubmit.innerText = "Ajouter";
        this.openCommentModal();
    }
    editComment(person_id, comment) {
        this.newCommentSubmit.onclick = () => this.newCommentHandler(person_id);
        this.newCommentText.value = decodeURIComponent(comment);
        this.newCommentSubmit.innerText = "Modifier";

        this.openCommentModal();
    }
    openCommentModal() {
        this.errorNewComment.innerText = "";
        this.openModalComment.click();
    }
    async disown(personId) {
        //const personId = this.confirmDeletePersonId.value;
        this.showMainSpinner()
        this.user.disown(personId, LocalStorage.getToken())
            .then(response => {
                this.hideMainSpinner()
                this.displayPerson()
                this.modalConfirmClose.click();
            });

    }
    disownRequest(personId) {
        this.openModalConfirmDelete.click();
        this.modalConfirmSubmit.onclick = () => this.disown(personId)
    }
}

window.personController = new PersonController()
