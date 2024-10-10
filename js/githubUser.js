export class githubUser {  //criacao da classe githubUser
    static search(username){ //criacao de um metodo estatico de busca de username
        const endpoint = `https://api.github.com/users/${username}` // local da interacão com uma API da web, no caso o github
        return fetch(endpoint) // captura e retorna os dados do endpoint por meio do fetch
        .then(data => data.json()) // converte os dados para json
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers

        })) //retorna os dados de login, nome, repositorios e seguidores
    }

}