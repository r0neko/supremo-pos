class Session {
    constructor(user) {
        this.user = user;
        this.sessionId = null;
        this.token = null;
        this.tokenExpiration = null;

        this.ping_handle = null;
    }

    destroy() {

    }
}

export default Session;

