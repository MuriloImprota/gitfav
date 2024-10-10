import { githubUser } from "./githubUser.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.users = JSON.parse(localStorage.getItem("@gitfav")) || [];
        console.log(this.users);

        githubUser.search("MuriloImprota").then(user => console.log(user));
    }

    saveData() {
        localStorage.setItem("@gitfav", JSON.stringify(this.users));
    }

    async add(username) {
        try {
            const userExists = this.users.find(user => user.login === username);
            if (userExists) {
                throw new Error("Usuário já cadastrado");
            }

            const user = await githubUser.search(username);
            if (!user.login) {
                throw new Error("Usuário não encontrado");
            }

            this.users = [user, ...this.users];
            this.update();
            this.saveData();
        } catch (error) {
            alert(error.message);
        }
    }

    delete(user) {
        this.users = this.users.filter(entry => entry.login !== user.login);
        this.update();
        this.saveData();
    }
}

export class favoritesView extends Favorites {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector("table tbody");
        this.update();
        this.onAdd();
       
    }

    onAdd() {
        const addButton = this.root.querySelector(".favorite");
        addButton.onclick = () => {
            const { value } = this.root.querySelector("#input-search");
            this.add(value);
        };
    }

    update() {
        this.removeAllTr();
        this.toggleTables(); // Chama a função para alternar a visibilidade das tabelas

        this.users.forEach(user => {
            const row = this.createRow();
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
            row.querySelector(".user img").alt = `Imagem de ${user.name}`;
            row.querySelector(".user a").href = `https://github.com/${user.login}`;
            row.querySelector(".user p").textContent = user.name;
            row.querySelector(".user span").textContent = user.login;
            row.querySelector(".Repositories").textContent = user.public_repos;
            row.querySelector(".Followers").textContent = user.followers;

            row.querySelector(".remove").onclick = () => {
                const isOkay = confirm("Tem certeza que deseja excluir essa linha?");
                if (isOkay) {
                    this.delete(user);
                }
            };

            this.tbody.append(row);
        });
    }

    createRow() {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/MuriloImprota.png" alt="foto de perfil">
                <a href="https://github.com/MuriloImprota">
                    <p>Murilo Improta</p>
                    <span>MuriloImprota</span>
                </a>
            </td>
            <td class="Repositories">16</td>
            <td class="Followers">2</td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `;
        return tr;
    }

    removeAllTr() {
        this.tbody.querySelectorAll("tr")
        .forEach(tr => tr.remove());
    }

    toggleTables() {
        this.removeAllTr();
        const table2 = this.root.querySelector("#table2"); // Tabela de favoritos
        const table1 = this.root.querySelector("#table1"); // Tabela "Nenhum favorito"

        // Verifica se a lista de usuários está vazia
        if (this.users.length === 0) {
            table1.classList.remove("hide"); // Esconde a tabela de favoritos
            table2.classList.add("hide"); // Mostra a tabela "Nenhum favorito"
          
        } else{
            table1.classList.add("hide"); // Esconde a tabela de favoritos
            table2.classList.remove("hide"); // Mostra a tabela "Nenhum favorito"
           
        }
    }


}
