class LocalStorage {
    static saveToken(token) {
        localStorage.setItem("jwt", token);
    }
    static getToken() {
        return localStorage.getItem("jwt")
    }
    static removeToken() {
        return localStorage.removeItem("jwt");
    }

}