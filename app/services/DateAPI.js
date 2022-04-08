class DateAPI {
    constructor() {
        this.api = "http://localhost:3000/";
        /* this.headers = new Headers({
         {
             'Accept'
         :
             'application/json',
                 'Content-Type'
         :
             'application/json'
         }
     })*/
        this.option = { method: 'GET',mode: 'cors', cache: 'default',
            headers: {'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : ""}};
    }
    async getUser(id, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "GET";
        this.option.body = undefined;
        return this.myFetch(`users/${id}`);
    }
    async getPersons(id, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "GET";
        this.option.body = undefined;
        return this.myFetch(`users/${id}/persons`);
    }
    async getMeetings(id, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "GET";
        this.option.body = undefined;
        return this.getMeetingFetch(id);
    }
    getMeetingFetch(user_id) {
        const url = `users/${user_id}/meetings/`;
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 200) {
                        resolve(response);
                    } else {
                        reject(response.status);

                    }
                })
                .catch(error => reject(error))
        });
    }
    disown(user_id, person_id, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "DELETE";
        this.option.body = undefined;
        return this.disownFetch(user_id, person_id);
    }
    async getUserlogin(email, password) {
        this.option.headers.Authorization = "";

        this.option.method = "POST";
        let payload = {
            email : email,
            password : password,
        }
        payload = JSON.stringify(payload);
        this.option.body = payload;
        return this.loginFetch();

    }
    async addPersonToUser(user_id, firstName, lastName, gender, birthday, comment, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "POST";
        let payload = {
            firstName : firstName,
            lastName : lastName,
            gender : gender,
            birthday : birthday,
            comment : comment
        }
        payload = JSON.stringify(payload);
        this.option.body = payload;
        return this.addPersonToUserFetch(user_id);
    }
    addPersonToUserFetch(user_id) {
        const url = `users/${user_id}/persons/`;
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 204) {
                        resolve(response);

                    } else if(response.status === 400) {
                        reject(response);

                    } else if(response.status === 403) {
                        reject(response.status);

                    } else {
                        reject(response.status);

                    }
                })
                .catch(error => reject(error))
        });
    }
    async register(firstName, lastName, email, password, birthday) {
        this.option.headers.Authorization = "";

        this.option.method = "POST";
        let payload = {
            email : email,
            firstName : firstName,
            lastName : lastName,
            password : password,
            birthday : birthday
        }
        payload = JSON.stringify(payload);
        this.option.body = payload;
        return this.registerFetch();
    }

    async checkToken(token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "GET";
        this.option.body = undefined;
        return this.tokenFetch();
    }
    loginFetch() {
        let url = `auth/login`;
        return new Promise((resolve, reject) => {


            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 200) {
                        resolve(response.text());
                    } else {
                        reject(response);

                    }
                })
                .catch(error => reject(error))
        });
    }
    registerFetch() {
        const url = `auth/register`;
        return new Promise((resolve, reject) => {


            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 201) {
                        resolve(response);

                    } else if(response.status === 400) {
                        reject(response);

                    } else {
                        reject(response.json());

                    }
                })
                .catch(error => reject(error))
        });
    }
    myPostFetch(url) {
        return new Promise((resolve, reject) => {
            let myInit = this.option;

            fetch(`${this.api}${url}`, myInit)
                .then(response => {
                    if(response.status === 200) {
                        resolve(response.text());
                    } else if(response.status === 201) {
                        resolve(response);

                    } else {
                        reject(response.json());

                    }
                })
                .catch(error => reject(error))
        });
    }
    disownFetch(user_id, person_id) {
        const url = `users/${user_id}/persons/${person_id}`;
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status !== 204) {

                        reject(response.status);
                    } else {

                        resolve(response);
                    }
                })
                .catch(error => reject(error))
        });
    }

    myFetch(url) {
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status !== 200) {

                        reject(response.status);
                    } else {

                        resolve(response.json());
                    }
                })
                .catch(error => reject(error))
        });
    }
    tokenFetch() {
        const url = "auth/token";
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status !== 204) {

                        reject(response.status);
                    } else {

                        resolve(response);
                    }
                })
                .catch(error => reject(error))
        });
    }

    async editOwn(user_id, person_id, comment, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "PUT";
        let  payload = {
            comment : comment
        };
        payload = JSON.stringify(payload);
        this.option.body = payload;
        return this.editOwnFetch(user_id, person_id);
    }
    editOwnFetch(user_id, person_id) {
        const url = `users/${user_id}/persons/${person_id}`;
        return new Promise((resolve, reject) => {


            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 204) {
                        resolve(response);

                    } else if(response.status === 400) {
                        reject(response);

                    } else {
                        reject(response.json());

                    }
                })
                .catch(error => reject(error))
        });
    }

    async addMeetingToPerson(user_id, person_id,
                       date, place, stars, comment, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "POST";
        let payload = {
            date: date,
            place: place,
            rank : stars,
            comment : comment
        }
        payload = JSON.stringify(payload);
        this.option.body = payload;
        return this.addMeetingToPersonFetch(user_id, person_id);
    }
    addMeetingToPersonFetch(user_id, person_id) {
        let url = `users/${user_id}/persons/${person_id}/meetings`;
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status === 204) {
                        resolve(response);

                    } else if(response.status === 400) {
                        reject(response);

                    } else {
                        reject(response.status);

                    }
                })
                .catch(error => reject(error))
        });
    }
    deleteMeeting(user_id, person_id, meeting_id, token) {
        this.option.headers.Authorization = `Bearer ${token}`;
        this.option.method = "DELETE";
        this.option.body = undefined;
        return this.deleteMeetingFetch(user_id, person_id, meeting_id);
    }
    deleteMeetingFetch(user_id, person_id, meeting_id) {
        const url = `users/${user_id}/persons/${person_id}/meetings/${meeting_id}`;
        return new Promise((resolve, reject) => {
            fetch(`${this.api}${url}`, this.option)
                .then(response => {
                    if(response.status !== 204) {

                        reject(response.status);
                    } else {

                        resolve(response);
                    }
                })
                .catch(error => reject(error))
        });
    }
}

