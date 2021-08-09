const ServerEndpoint = "http://localhost";

async function SearchProductID(prid) {
    return fetchJSON(ServerEndpoint + `/api/product/lookup/id/${prid}`);
}

async function fetchJSON() {
    return fetch(...arguments).then(r => {
        console.log(r);
        return r;
    }).then(r => r.json());
} 

module.exports = {
    SearchProductID,
    fetchJSON
};