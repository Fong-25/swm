const rizz = document.getElementById('sentence');
const author = document.getElementById('author');
const button = document.getElementById('generate');
const quoteContainer = document.querySelector('.quote-container');
const img = document.getElementById('gen');

img.addEventListener('click', (e) => {
    quoteContainer.classList.toggle('read');
})

button.onclick = function(){
    fetch('https://dummyjson.com/quotes/?limit=0').then(respose => respose.json()).then(json => {
        const number = Math.floor(Math.random()*1400) + 1;
        const sentence = json.quotes[number].quote;
        const auth = json.quotes[number].author;

        rizz.innerHTML = `${sentence}`;
        author.innerHTML = `-${auth}`
    })
    .catch(error => console.error("Error fetching quotes:", error));
}