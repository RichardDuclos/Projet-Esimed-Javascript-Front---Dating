class DateController extends BaseController {
    constructor() {
        super()

        this.isConnected()
            .then(result => {
                if(result.status !== 204) {
                    navigate("index");
                } else {
                    this.newMeetingSpinner = document.getElementById("new-meeting-spinner");
                    this.selectPersonMeeting = document.getElementById("selectPersonMeeting");

                    this.newMeetingPlace = document.getElementById("newMeetingPlace");
                    this.newMeetingDate = document.getElementById("newMeetingDate");

                    this.newMeetingSubmit = document.getElementById("newMeetingSubmit");
                    this.newMeetingSubmit.onclick = () => this.newMeetingHandler();
                    this.newMeetingSelectStar = document.getElementById("new-meeting-select-star");
                    this.newMeetingComment = document.getElementById("newMeetingComment");
                    this.newMeetingConfirm = document.getElementById("newMeetingConfirm")

                    this.newMeetingSelectStar = document.getElementById("new-meeting-select-star");
                    let newMeetingStarRatingControl = new StarRating( '#new-meeting-select-star',
                        {tooltip : "Choisir une note"});

                    this.openModalConfirmDelete = document.getElementById("openModalConfirmDelete");
                    this.modalConfirmSubmit = document.getElementById("modalConfirmSubmit");
                    this.modalConfirmClose = document.getElementById("modalConfirmClose");

                    this.errorNewMeetingPlace = document.getElementById("error-new-meeting-place");
                    this.errorNewMeetingDate = document.getElementById("error-new-meeting-date");
                    this.errorNewMeetingRank = document.getElementById("error-new-meeting-rank");
                    this.errorNewMeetingComment = document.getElementById("error-new-meeting-comment");


                    this.meetingsWrapper = document.getElementById("meetings-wrapper");

                    this.mobileNewMeeting = document.getElementById("mobileNewMeeting");
                    this.root = document.getElementById("root");
                    this.root.classList.remove("hidden")
                    this.setTitle("Rendez vous");
                    let home = {
                        text : "Accueil",
                        view : "index",
                    }
                    let date = {
                        text : "Rendez vous",
                        view : "date",
                        active : true
                    }
                    let links = [home, date];
                    this.setNavbarLinks(links);
                    const token = this.parseJwt(LocalStorage.getToken());
                    const id = token.id;

                    User.getUser(id, LocalStorage.getToken())
                        .then(result => {
                            this.user = result;
                            this.newMeetingSpinner.classList.remove("hidden");
                            this.user.getPersons(LocalStorage.getToken())
                                .then(result => {
                                    let text = "";
                                    result.forEach(person => {
                                        text += `<option value="${person.id}">${person.firstName} ${person.lastName}</option>`;
                                    });
                                    this.newMeetingSpinner.classList.add("hidden");
                                    this.selectPersonMeeting.innerHTML = text;
                                    this.displayMeetings();
                                })
                        });

                }
            });
    }

    async newMeetingHandler() {
        this.errorNewMeetingComment.innerText = "";
        this.errorNewMeetingRank.innerText = "";
        this.errorNewMeetingPlace.innerText = "";
        this.errorNewMeetingDate.innerText = "";
        this.newMeetingConfirm.innerText = "";
        let error = false;
        if(this.newMeetingComment.value.trim() === "") {
            error = true;
            this.errorNewMeetingComment.innerText = "Veuillez écrire un commentaire";
        } else if(this.newMeetingComment.value.length > 500) {
            error = true;
            this.errorNewMeetingComment.innerText = "Votre commentaire doit faire 500 caractères ou moins";
        }
        if(this.newMeetingSelectStar.value.trim() === "") {
            error = true;
            this.errorNewMeetingRank.innerText = "Veuillez noter le rendez vous";
        }
        if(this.newMeetingPlace.value.trim() === "") {
            error = true;
            this.errorNewMeetingPlace.innerText = "Veuillez renseigner le lieu"
        }
        if(this.newMeetingDate.value.trim() === "") {
            error = true;
            this.errorNewMeetingDate.innerText = "Veuillez renseigner la date";

        }
        if(error) {
            return;
        }

        this.newMeetingSpinner.classList.remove("hidden");
        this.newMeetingConfirm.innerText = "";
        let meeting = new Meeting(
            null,
            this.newMeetingDate.value,
            this.newMeetingPlace.value,
            this.newMeetingSelectStar.value,
            this.newMeetingComment.value);
        let person = new Person(
            this.selectPersonMeeting.value,
            null,
            null,
            null,
            null
        )

        person.addMeeting(this.user, meeting, LocalStorage.getToken())
            .then(result => {
                this.newMeetingSpinner.classList.add("hidden");
                this.displayMeetings();
                this.newMeetingPlace.value = "";
                this.newMeetingDate.value = "";
                this.newMeetingComment.value = "";
                this.newMeetingSelectStar.value = "";
                this.newMeetingConfirm.innerText = "La rencontre à bien été ajouté";
                this.displayMeetings();


            })
            .catch(err => {


                this.newMeetingSpinner.classList.add("hidden");
                if(err.status === 400) {
                    err.json()
                        .then(result => {
                            result.errors.forEach(error => {
                                if(error.param === "comment") {
                                    this.errorNewMeetingComment.innerText = error.msg;
                                }
                                if(error.param === "rank") {
                                    this.errorNewMeetingRank.innerText = error.msg;
                                }
                                if(error.param === "place") {

                                    this.errorNewMeetingPlace.innerText = error.msg
                                } if(error.param === "date") {
                                    this.errorNewMeetingDate.innerText = error.msg
                                }

                            })
                        });
                }

            })
    }

    async displayMeetings() {
        this.showMainSpinner()
        this.user.getMeetings(LocalStorage.getToken())
            .then(response => {
                response.json()
                    .then(result => {

                        this.hideMainSpinner();
                        let text = "";
                        if(result.length === 0) {
                            text += this.getNoMeetingHTML();
                        }
                        result.forEach(row => {
                            text += this.getMeetingHTML(row);
                        })
                        this.meetingsWrapper.innerHTML = text;
                        let meetingStarRatingControl = new StarRating( '.meetingStar',
                            {tooltip: "Choisir une note"});
                    })

            });
    }
    getMeetingHTML(row) {
        let date = new  Date(row.meeting.date);
        let text = `
            <div class="card person-card">
                <button class="icon-button person-trash" onclick="window.DateController.deleteRequest('${row.person.id}','${row.meeting.id}')"  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path fill="red" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </button>
                <div class="card-title person-card-title">
                    ${row.person.firstName} ${row.person.lastName} 
                </div>
                <div class="card-body">
                    <div class="container">
                    Le ${date.toLocaleDateString()} à ${row.meeting.place}
                    </div>
                    <div id="new-meeting-star-wrapper">
                        <select disabled id="new-meeting-select-star" class="meetingStar star-rating">
                            <option value="" >Choisir une note</option>
                            <option value="5" `; if(row.meeting.rank === 5) {text += "selected"} text += `>Excellent !!</option>
                            <option value="4" `; if(row.meeting.rank === 4) {text += "selected"} text += `>J'ai adoré</option>
                            <option value="3" `; if(row.meeting.rank === 3) {text += "selected"} text += `>C'etait bien</option>
                            <option value="2" `; if(row.meeting.rank === 2) {text += "selected"} text += `>Bof</option>
                            <option value="1" `; if(row.meeting.rank === 1) {text += "selected"} text += `>Super nul</option>
                        </select>
                    </div>
                    <div class="meeting-comment">
                       `;
        if(row.meeting.comment !== null) {

            text+= `${row.meeting.comment} `;
        } else {
            text+= `Aucun commentaire`;
        }

        text+= `
                    </div>

                    <!-- meetingStar -->
                </div>               
            </div>   
            
            
        `;
        return text;
    }



    getNoMeetingHTML() {
        return `Vous n'avez pas encore faits de rencontres.
        Appuyez sur 
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path fill="blueviolet" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
        </svg> pour ajouter de nouvelles rencontres.
`;
    }
    deleteRequest(person_id, meeting_id) {
        this.openModalConfirmDelete.click();
        this.modalConfirmSubmit.onclick = () => this.delete(person_id, meeting_id);
    }
    delete(person_id, meeting_id) {

        const person = new Person(person_id, null, null, null, null);
        const meeting = new Meeting(meeting_id, null, null, null, null);
        this.showMainSpinner();
        this.user.deleteMeeting(person, meeting, LocalStorage.getToken())
            .then(result => {
                this.hideMainSpinner();
                this.displayMeetings();
                this.modalConfirmClose.click();
            })
            .catch(err => {

            })
    }


}

window.DateController = new DateController()
