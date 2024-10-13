export class githubUser {  //github class creation
    static search(username){ //static method creation for search
        const endpoint = `https://api.github.com/users/${username}` // API interaction point
        return fetch(endpoint) // endpoint data capture e return by fetch
        .then(data => data.json()) // data conversion for json
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers

        })) //return data fields login, name, repositories and followers
    }

}