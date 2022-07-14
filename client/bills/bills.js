class GroupCard {
    constructor(group) {
        let { group_id: groupId, name } = group;
        this.groupId = groupId;
        this.name = name;
        this.createCardContainer();
    }
    createCardContainer() {
        this.cardContainer = document.createElement('div');
        this.cardContainer.classList.add("rounded", "border-solid", "border-2", "w-1/4", "min-h-max", "min-w-fit", "h-32", "p-6", "text-center", "shadow-md", "shadow-cyan-500/50");
        this.createGroupIdElement();
        this.createNameElement();
        this.cardContainer.append(this.groupIdElement, this.nameElement);
    }
    createGroupIdElement() {

        this.groupIdElement = document.createElement("h3");
        this.groupIdElement.classList.add("mb-4", "text-xl");
        this.groupIdElement.textContent = `Group ID: ${this.groupId}`;
    }
    createNameElement() {

        this.nameElement = document.createElement("p");
        this.nameElement.textContent = this.name;
    }

    getCardContainer() {
        return this.cardContainer;
    }

}
const getAccounts = async () => await fetch("//localhost:3001/api/v1/accounts",
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }
);

const clearGroups = () => {
    const groupsDisplay = document.querySelector("div#contentContainer");
    groupsDisplay.replaceChildren();
}

const displayGroups = async (accounts) => {
    const contentContainer = document.querySelector("div#contentContainer");
    for (let account of accounts) {
        const groupCard = new GroupCard({ "group_id": account.group_id, "name": account.name });
        contentContainer.appendChild(groupCard.getCardContainer());
    }
};

const loadContent = async () => {
    if (localStorage.getItem("token")) {
        const accounts = await (await getAccounts()).json();
        displayGroups(accounts.accounts);
    }
    else {
        window.location.href = "../login/login.html";
    }
};

document.addEventListener("DOMContentLoaded", async () => {

    loadContent();
});

document.querySelector("form#groupCreationForm").addEventListener("submit", async (event) => {

    const groupId = document.querySelector("input#groupId").value;

    const response = await fetch("//localhost:3001/api/v1/accounts",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ "groupId": groupId })
        }
    );

    const responseJson = await response.json();
    console.log(responseJson);
});

document.querySelectorAll("div#contentContainer div").forEach((groupCard) => {