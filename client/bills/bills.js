class BillTable {
    constructor(bills) {
        this.bills = bills;
        this.createTable();
    }
    createTable() {
        this.tableElement = document.createElement('table');
        this.tableElement.classList.add("table-auto", "w-full", "h-auto", "min-h-max", "min-w-fit", "h-32", "p-6", "text-center", "shadow-md", "shadow-cyan-500/50");
        this.createHeadElement();
        this.createBodyElement();
        this.tableElement.append(this.headElement, this.bodyElement);
    }
    createHeadElement() {
        this.headElement = document.createElement("thead");
        this.headElement.classList.add("bg-gray-200");
        const rowElement = document.createElement("tr");
        const idCellElement = document.createElement("th");

        const descriptionCellElement = document.createElement("th");
        const amountCellElement = document.createElement("th");

        idCellElement.textContent = "ID";
        descriptionCellElement.textContent = "Description";
        amountCellElement.textContent = "Amount";
        rowElement.append(idCellElement, descriptionCellElement, amountCellElement);
        this.headElement.append(rowElement);
    }
    createBodyElement() {
        this.bodyElement = document.createElement("tbody");

        for (let bill of this.bills) {
            console.log(bill);
            const rowElement = document.createElement("tr");
            const idCellElement = document.createElement("td");
            const descriptionCellElement = document.createElement("td");
            const amountCellElement = document.createElement("td");

            idCellElement.textContent = bill.id;
            descriptionCellElement.textContent = bill.description;
            amountCellElement.textContent = `$${bill.amount || 0}`;
            rowElement.append(idCellElement, descriptionCellElement, amountCellElement);
            this.bodyElement.append(rowElement);
        }

    }

    getTable() {
        return this.tableElement;
    }

}
const getBills = async (groupId) => await fetch(`//localhost:3001/api/v1/bills/${groupId}}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }
);

const clearBills = () => {
    const groupsDisplay = document.querySelector("div#contentContainer");
    groupsDisplay.replaceChildren();
}

const displayBills = async (bills) => {
    const contentContainer = document.querySelector("div#contentContainer");
    const billTable = new BillTable(bills);
    contentContainer.appendChild(billTable.getTable());
};

const loadContent = async () => {
    if (localStorage.getItem("token")) {
        const groupId = getGroupId();
        if (!groupId) {
            window.location.href = "../groups/groups.html";
        }
        const responseJson = await (await getBills(groupId)).json();
        if (responseJson.message) {
            displayMessage(responseJson.message);
        }
        else {
            displayBills(responseJson.bills);
        }
    }
    else {
        window.location.href = "../login/login.html";
    }
};

document.addEventListener("DOMContentLoaded", async () => loadContent());

document.querySelector("form#billCreationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const groupId = getGroupId();
    const amount = document.querySelector("input#amount").value;
    const description = document.querySelector("input#description").value;

    const response = await fetch("//localhost:3001/api/v1/bills",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ "groupId": groupId, "amount": amount, "description": description })
        }
    );

    const responseJson = await response.json();
    if (responseJson.message) {
        displayMessage(responseJson.message);
    }
    if (response.status == 201) {
        window.location.href = `../bills/bills.html?groupId=${groupId}`;
    }
});


const getGroupId = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.groupId;
};

const displayMessage = (message) => {
    const contentContainer = document.querySelector("div#contentContainer");
    const messageElement = document.createElement("p");
    messageElement.classList.add('text-red-500');
    messageElement.textContent = message;
    contentContainer.appendChild(messageElement);
}