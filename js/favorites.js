import { githubUser } from "./githubUser.js";

export class Favorites { //Favorites class creation
    constructor(root) { //class constructor with root parameter.
        this.root = document.querySelector(root); //defining the root in html element, we call in main file
        this.load();
    }

    load() { //function to load localstorage data under the key gitfav
        this.users = JSON.parse(localStorage.getItem("@gitfav")) || []; //if nothing is found in localStorage, it defaults do an empty array
        console.log(this.users);

        githubUser.search("MuriloImprota").then(user => console.log(user));
    }

    saveData() { // function that Converts the this.users Array to a JSON String and store in localStorage
        localStorage.setItem("@gitfav", JSON.stringify(this.users));
    }

    async add(username) { //function to add user data to the table favorites
        try {
            const userExists = this.users.find(user => user.login === username); 
            if (userExists) {
                throw new Error("Usuário já cadastrado");
            }

            const user = await githubUser.search(username);
            if (!user.login) {
                throw new Error("Usuário não encontrado");
            }

            this.users = [user, ...this.users]; //the new user is add to users list
            this.update();
            this.saveData();
        } catch (error) {
            alert(error.message);
        }
    }

    delete(user) { //function to delete user data
        this.users = this.users.filter(entry => entry.login !== user.login);
        this.update();
        this.saveData();
    }
}

export class favoritesView extends Favorites { // View class inherit favorites attributes, and adding update and onAdd functions
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector("table tbody");
        this.update();
        this.onAdd();
       
    }

    onAdd() { // function to send data request through the button
        const addButton = this.root.querySelector(".favorite");
        addButton.onclick = () => {
            const { value } = this.root.querySelector("#input-search");
            this.add(value);
        };
    }

    update() {
        this.removeAllTr(); // call function removealltr after the update is settled
        this.toggleTables(); // call function toggleTabbles after the update is settled

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

    createRow() {   //function to create the row structure
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

    removeAllTr() {     //function to remove all tr rows in the table
        this.tbody.querySelectorAll("tr")
        .forEach(tr => tr.remove());
    }


    toggleTables() { //function to switch tables, when a user is inserted or all removed
        this.removeAllTr();
        const table2 = this.root.querySelector("#table2"); // favorite table
        const table1 = this.root.querySelector("#table1"); // "No favorite table"

        // check if user list is empty
        if (this.users.length === 0) { // if users list equals zero
            table1.classList.remove("hide"); // Remove hide property on table 1
            table2.classList.add("hide"); // add hide property on table 2
          
        } else{
            table1.classList.add("hide"); // add hide property on table 1
            table2.classList.remove("hide"); // remove property hide on table 2
        }
    }


}
