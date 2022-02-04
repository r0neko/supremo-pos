import API from "./API";

class Session {
    constructor(user, token) {
        this.user = user;
        this.token = token;

        this.ping_handle = null;
    }

    destroy() {
        return API.DestroySession();
    }
}

export default Session;

