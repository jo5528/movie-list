const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')

function renderMovie (items) {
let rawHTML = ''
items.forEach(item => {
  rawHTML += ` 
    <div class="col-sm-3">
     <div class="mb-2">
      <div class="card">
      <img src="${POSTER_URL + item.image}" class="card-img-top" alt="movie-poster">
      <div class="card-body">
        <h5 class="card-title" id="movie-title">${item.title}</h5>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
         <button class="btn btn-danger btn-delete" data-id="${item.id}">X</button>
       </div>
       </div>
      </div>       
     </div>
    `
     })
   dataPanel.innerHTML = rawHTML
}

function modalMovie(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(`${INDEX_URL}${id}`).then((response) => {
  const data = response.data.results
  modalTitle.innerText = data.title
  modalDate.innerText = data.release_date
  modalDescription.innerText = data.description
  modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" alt='movie-poster' class="img-fluid">`
  })
}
//刪除該電影，後要重新渲然剩下的movies
function deleteFavMovie(id) {
  if(!movies || !movies.length) return
  const movieIndex = movies.findIndex(movie => movie.id === id) 
  if (movieIndex !== -1) {
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovie(movies)
  }
}

dataPanel.addEventListener('click', function onClicked (event) {
if (event.target.matches('.btn-primary')) {
modalMovie(Number(event.target.dataset.id))
 } else if (event.target.matches('.btn-delete')) {
  console.log(event.target.dataset.id)
  deleteFavMovie(Number(event.target.dataset.id))
  }
})
renderMovie(movies)