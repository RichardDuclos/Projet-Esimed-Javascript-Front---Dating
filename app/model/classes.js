class User {

    constructor(id, firstName, lastName, email, birthday, role) {
        this.datingAPI = new DateAPI();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birthday = birthday;
        this.role = role
    }
    static async register(firstName, lastName, email, password, birthday) {
        let datingAPI = new DateAPI();
        return  await datingAPI.register(firstName, lastName, email, password, birthday);
    }
    static async login(email, password) {
        let datingAPI = new DateAPI();
        return await datingAPI.getUserlogin(email, password);
    }
    static async getUser(id, token) {
        let datingAPI = new DateAPI();
        const res = await datingAPI.getUser(id, token);
        if(res.email !== undefined) {
            return new User(res.id, res.firstName,
                res.lastName, res.email,
                res.birthday, res.role)
        }
        return null;

    }
    async getPersons(token) {
        let datingAPI = new DateAPI();
        const res = await datingAPI.getPersons(this.id, token);
        const array = [];
        res.forEach(person => {
            array.push(
                new Person(
                    person.id,
                    person.firstName, person.lastName, person.gender, person.birthday
                    , person.comment
                ),


            );
        });
        return array;
    }
    async disown(personId, token) {
        let datingAPI = new DateAPI();
        return await datingAPI.disown(this.id, personId, token);
    }
    async addPerson(person, token) {
        if(person.comment === "") {
            person.comment =null;
        }
        let datingAPI = new DateAPI();
        return await datingAPI.addPersonToUser(
            this.id,
            person.firstName,
            person.lastName,
            person.gender,
            person.birthday,
            person.comment, token);
    }
    async editComment(person_id, comment, token) {
        let datingAPI = new DateAPI();
        if(comment === "") {
            comment = null;
        }
        return await datingAPI.editOwn(this.id, person_id, comment, token);
    }
    async getMeetings(token) {
        let datingAPI = new DateAPI();
        return await datingAPI.getMeetings(this.id, token);

    }
    async deleteMeeting(person, meeting, token) {
        let datingAPI = new DateAPI();
        return await datingAPI.deleteMeeting(this.id, person.id, meeting.id, token);
    }

}


class Person {
    constructor(id, firstName, lastName, gender, birthday, comment) {
        this.datingAPI = new DateAPI();
        this.id = id;
        this.gender = gender;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.comment = comment;
    }
    async addMeeting(user, meeting, token) {
        this.datingAPI = new DateAPI();
        return await this.datingAPI.addMeetingToPerson(user.id, this.id ,
            meeting.date, meeting.place, meeting.rank, meeting.comment, token)
    }
}

class Token {
    static async checkToken() {
        let token = LocalStorage.getToken();
        if(token === null) {
            return false;
        }
        let datingAPI = new DateAPI();

        return await datingAPI.checkToken(token)
    }

}

class Meeting {
    constructor(id, date, place, rank, comment) {
        this.id = id;
        this.date = date;
        this.place = place;
        this.rank = rank;
        this.comment = comment;
    }
}