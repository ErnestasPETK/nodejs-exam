class ArticleCard {
    constructor(article) {
        const { content, date, title } = article;
        this.date = date.split("T")[0];
        this.title = title;
        this.content = content;
        this.createCardContainer();
    }
    createCardContainer() {
        this.cardContainer = document.createElement('div');
        this.cardContainer.classList.add("rounded", "border-solid", "border-2", "w-1/4", "p-6", "shadow-lg", "text-center");
        this.createDateElement();
        this.createContentElement();
        this.createTitleElement();
        this.cardContainer.append(this.titleElement, this.dateElement, this.contentElement);
    }
    createDateElement() {

        this.dateElement = document.createElement("p");
        this.dateElement.textContent = this.date;
    }
    createContentElement() {

        this.contentElement = document.createElement("p");
        this.contentElement.textContent = this.content;
    }
    createTitleElement() {

        this.titleElement = document.createElement("h3");
        this.titleElement.classList.add("mb-4");
        this.titleElement.textContent = this.title;
    }
    getCardContainer() {
        return this.cardContainer;
    }

}
const getArticles = async () => await fetch("//localhost:3001/api/v1/content",
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }
);

const clearArticles = () => {
    const articlesDisplay = document.querySelector("div#contentContainer");
    articlesDisplay.replaceChildren();
}

const displayArticles = async (articles) => {
    const contentContainer = document.querySelector("div#contentContainer");
    for (let article of articles) {
        const articleCard = new ArticleCard(article);
        contentContainer.appendChild(articleCard.getCardContainer());
    }
};

const loadContent = async () => {
    if (localStorage.getItem("token")) {
        const articles = await (await getArticles()).json();
        displayArticles(articles.articles);
    }
    else {
        window.location.href = "../login/login.html";
    }
};

document.addEventListener("DOMContentLoaded", async () => {

    loadContent();
});