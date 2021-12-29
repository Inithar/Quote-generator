const quoteText = document.querySelector('.quote');
const authorText = document.querySelector('.author');
const quoteBox = document.querySelector('.quote-box');
const favQuotesBox = document.querySelector('.fav-quotes');
const error = document.querySelector('.quote-box__error');
const loader = document.querySelector('.loader');

// Buttons
const headerHeartBtn = document.querySelector('.header__icon--heart');
const quoteBoxHeartBtn = document.querySelector('.quote-box__top-btn--heart');
const closeFavBtn = document.querySelector('.header__icon--close-fav');
const newQuoteBtn = document.querySelector('.quote-box__btn--quote');
const twitterBtn = document.querySelector('.quote-box__btn--twitter');

let quotes = [];

const showLoadingSpinner = () => {
	quoteBox.style.display = 'none';
	loader.style.display = 'block';
};

const removeLoadingSpinner = () => {
	quoteBox.style.display = 'block';
	loader.style.display = 'none';
};

/* generate a new quote  */
const newQuote = () => {
	const quoteNumber = Math.floor(Math.random() * quotes.length);
	const quote = quotes[quoteNumber];
	quoteText.textContent = quote.text;

	if (!quote.author) {
		authorText.textContent = 'Unknown';
	} else {
		authorText.textContent = quote.author;
	}
};

/* shares a quote on twitter  */
const tweetQuote = () => {
	const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
	window.open(twitterUrl, '_blank');
};

/* adding the quote to favorites */
const addToFav = () => {
	const key = quoteText.textContent;
	const value = authorText.textContent;

	if (key && value) {
		localStorage.setItem(key, value);
	}
};

/* open favorite quotes section  */
const showFav = () => {
	quoteBox.style.display = 'none';
	favQuotesBox.style.display = 'block';
	favQuotesBox.innerHTML = '';

	if (localStorage.length != 0) {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);

			favQuotesBox.innerHTML += `	<div class="quote-box">
					<button class="quote-box__top-btn quote-box__top-btn--delete">
						<i class="fas fa-times"></i>
					</button>
					<div class="quote-box__text">
						<p class="quote-box__quote">
							<i class="quote-box__icon fas fa-quote-left"></i>
							<span class="quote">${key}</span>
						</p>
						<p class="quote-box__author">- <span class="author">${value}</span> -</p>
					</div>
				</div>
			`;
		}
	} else {
		const paragraph = document.createElement('p');
		paragraph.setAttribute('class', 'no-quotes');
		paragraph.textContent = 'No favorite quotes';
		favQuotesBox.appendChild(paragraph);
	}
};

/* removes favorite quote */
const deleteFavQuote = (e) => {
	if (e.target.closest('button') !== null) {
		const button = e.target.closest('button');
		const quoteDiv = button.nextElementSibling;
		const quoteParagraph = quoteDiv.firstElementChild;

		localStorage.removeItem(quoteParagraph.lastElementChild.textContent);
		showFav();
	}
};

/* closes favorite quotes section  */
const closeFav = () => {
	quoteBox.style.display = 'block';
	favQuotesBox.style.display = 'none';
};

/* getting data from API */
async function getQuotes() {
	showLoadingSpinner();
	const apiUrl = 'https://type.fit/api/quotes';
	try {
		const response = await fetch(apiUrl);
		quotes = await response.json();
		newQuote();
		error.textContent = '';
		removeLoadingSpinner();
	} catch {
		error.textContent = 'Sorry, something went wrong. Please try again later!';
		removeLoadingSpinner();
	}
}

/* addEventListeners */
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);
quoteBoxHeartBtn.addEventListener('click', addToFav);
headerHeartBtn.addEventListener('click', showFav);
closeFavBtn.addEventListener('click', closeFav);
favQuotesBox.addEventListener('click', deleteFavQuote);

/* onload */
getQuotes();
