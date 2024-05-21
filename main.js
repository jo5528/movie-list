const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filterMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
let currentPage = 1
const MOVIES_PER_PAGE = 12
const modeChange = document.querySelector('#change-mode')


const view = {  
//卡片方式渲染
  renderMovie (items) {
  if (dataPanel.dataset.mode === 'card-mode') {
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
         <button class="btn btn-success btn-add-favorite" data-id="${item.id}">+</button>
        </div>
       </div>
      </div>       
     </div>
    `
    })
    dataPanel.innerHTML = rawHTML
  } //列表方式渲染
    else if (dataPanel.dataset.mode === 'list-mode') {
    let rawHTML = `<ul class="list-group col-12 mb-2">`
    items.forEach(item => {
    rawHTML +=`
      <li class="list-group-item d-flex justify-content-between m-2">
      <h5 class="card-title">${item.title}</h5>
       <div class="pl-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
        <button class="btn btn-success btn-add-favorite" data-id="${item.id}">+</button>
      </div>
    </li>`
   })
   rawHTML += '</ul>'
   dataPanel.innerHTML = rawHTML   
  } 
 },//modal顯示的資訊
  modalMovie(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  //request api
  axios.get(INDEX_URL + id).then((response) => {
  const data = response.data.results
  modalTitle.innerText = data.title
  modalDate.innerText = data.release_date
  modalDescription.innerText = data.description
  modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
},//電影依據頁數顯示 
  getMoviesByPage (page) {
     const data = filterMovies.length ? filterMovies : movies
     const startIndex = (page - 1)* MOVIES_PER_PAGE
     return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
  },
  //總頁數依照電影數量渲染
   renderPaginator (amount) {
     const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE) 
     let html = ''
     for (let page = 1; page <= numberOfPages; page++){
     html += `<li class="page-item">
      <a class="page-link" href="#" data-page="${page}">${page}
      </a>
     </li>`
    }
   paginator.innerHTML = html
  }
}

const model = {
  //在電影旁邊點選"＋"即可加入收藏
  addToFavorite(id) {
  //從localStorage裡取出favoriteMovies並轉換成java 格式，如果沒有則賦予空陣列
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)  
  if (list.some(movie=> movie.id === id)) {
  return alert('該電影已在收藏清單中')
  }
   list.push(movie)
   localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
}

const controller = {
generateMovie() {
axios
  .get(INDEX_URL) 
  .then(response => {
    movies.push(...response.data.results)
    view.renderPaginator(movies.length)
    view.renderMovie(view.getMoviesByPage(currentPage));
  })
  .catch((err) => console.log(err))
  },
  //判斷決定渲染的方式
  changeDisplayMode (displayMode) {
   if(dataPanel.dataset.mode === displayMode) return
   dataPanel.dataset.mode = displayMode
  }
}
//變更電影顯示的樣式
modeChange.addEventListener('click', 
function onSwitchClicked(event) {
 if (event.target.matches('#card-mode-button')) {
   controller.changeDisplayMode ('card-mode');
   view.renderMovie(view.getMoviesByPage(currentPage));
 } else if(event.target.matches('#list-mode-button')) {
    controller.changeDisplayMode ('list-mode');
    view.renderMovie(view.getMoviesByPage(currentPage));
  }   
})
//點擊more或是+會觸發相關動作
dataPanel.addEventListener('click', function onClicked (event) {
if (event.target.matches('.btn-primary')) {
  view.modalMovie(Number(event.target.dataset.id))
 } else if (event.target.matches('.btn-add-favorite')) {
  model.addToFavorite(Number(event.target.dataset.id))
  }
})
//搜尋電影
searchForm.addEventListener('submit', function submitForm (event) {
  event.preventDefault(); //不要做預設動作：重新整理網頁
  const keyword = searchInput.value.trim().toLowerCase()
  filterMovies = movies.filter(movie => 
  movie.title.toLowerCase().includes(keyword)
  )
  if (filterMovies.length === 0) {
    return alert('Not found movies with keyword: ' + keyword)
  }
  currentPage = 1 
  view.renderPaginator(filterMovies.length)
  view.renderMovie(view.getMoviesByPage(currentPage))
})
//點擊不同頁面，顯示出不同的電影
paginator.addEventListener('click', function pageClicked(event){
  if(event.target.tagName !=='A') return
  const page = Number(event.target.dataset.page)
  currentPage = page
  view.renderMovie (view.getMoviesByPage(currentPage))
})
controller.generateMovie()

