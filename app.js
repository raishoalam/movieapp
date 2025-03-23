const apiUrl = 'http://localhost:3008/api';

// ** Signup Function
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (data.success) {
        window.location.href = 'login.html';
    } else {
        alert('Signup failed');
    }
});

// ** Login Function
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'movies.html';
    } else {
        alert('Login failed');
    }
});

// ** Movie List - This is wrapped in an async function
async function loadMovies() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch(`${apiUrl}/movies`);
    const movies = await response.json();

    let movieListHtml = '';
    movies.forEach((movie) => {
        movieListHtml += `
            <div class="movie-item">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <a href="movie-details.html?id=${movie.id}">View Details</a>
            </div>
        `;
    });

    document.getElementById('movieList').innerHTML = movieListHtml;
}

// ** Movie Details Page - Wrapped in an async function
async function loadMovieDetails() {
    const movieId = new URLSearchParams(window.location.search).get('id');
    
    const response = await fetch(`${apiUrl}/movies/${movieId}`);
    const movie = await response.json();
    
    let movieDetailHtml = `
        <h2>${movie.title}</h2>
        <p>${movie.description}</p>
    `;

    const reviewResponse = await fetch(`${apiUrl}/reviews?movieId=${movieId}`);
    const reviews = await reviewResponse.json();

    let reviewsHtml = '';
    reviews.forEach(review => {
        reviewsHtml += `
            <div class="review-item">
                <p>${review.review_text}</p>
                <button onclick="likeReview(${review.id})">Like</button>
                <button onclick="unlikeReview(${review.id})">Unlike</button>
                <button onclick="editReview(${review.id})">Edit</button>
                <button onclick="deleteReview(${review.id})">Delete</button>
            </div>
        `;
    });

    document.getElementById('movieDetail').innerHTML = movieDetailHtml;
    document.getElementById('reviews').innerHTML = reviewsHtml;
}

// ** Check if the page is the movie list page and load movies
if (window.location.pathname === '/movies.html') {
    loadMovies();
}

// ** Check if the page is the movie details page and load details
if (window.location.pathname === '/movie-details.html') {
    loadMovieDetails();
}

// ** Review Actions (Like/Unlike/Edit/Delete)
function likeReview(reviewId) {
    alert(`Liked review with ID: ${reviewId}`);
}

function unlikeReview(reviewId) {
    alert(`Unliked review with ID: ${reviewId}`);
}

function editReview(reviewId) {
    alert(`Editing review with ID: ${reviewId}`);
}

function deleteReview(reviewId) {
    alert(`Deleted review with ID: ${reviewId}`);
}
