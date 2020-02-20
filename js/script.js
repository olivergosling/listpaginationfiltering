/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

const listItemElements = document.querySelectorAll('.student-item');
const noOfItemsPerPage = 10;

/**
 * Display the students from specfied page
 * @param {NodeList} list A list of students
 * @param {integer} The page number to view
 */
const showPage = (list, page) => {
  console.log(list);
  const startIndex = (page * noOfItemsPerPage) - noOfItemsPerPage;
  const endIndex = page * noOfItemsPerPage;

  let i;
  for (i = 0; i < list.length; i++){
    if( (i >= startIndex && i < endIndex)){
      list[i].style.display = 'block';
    }else{
      list[i].style.display = '';
    }
  }
}

/**
 * Remove active class from pagination menu
 */
const clearActiveMenuItems = () => {
  const paginationLinks = document.querySelectorAll('.pagination a');
  paginationLinks.forEach((link) => {
    link.classList.remove('active');
  });
}

/**
 * Set 'active' class on specified menu item index
 * @param {integer} Menu index to set active
 */
const setActiveMenuItem = (index) => {
  const menuItem = document.querySelectorAll('.pagination a')[--index];
  menuItem.classList.add('active');
}

/*
 * Create menu item elements based on the number of students
 * and the specified number of students per page. Add event
 * listeners to detect when page items are clicked on then 
 * call a function to display the selected page.
 * @param {NodeList} A list of students
 */
const appendPageLinks = (list) => {

  // remove any existing pagination menu
  const existingPaginationElement = document.querySelector('.pagination');
  if(existingPaginationElement){
    existingPaginationElement.remove();
  }

  // calculate number of pages only including matched items
  const matchedItems = [...listItemElements].filter(e => {
    return !e.classList.contains('not-matched');
  });

  const noOfPages = matchedItems.length / noOfItemsPerPage;

  const newLi = (index) => {
    const anchor = document.createElement('a');
    const li = document.createElement('li');
    anchor.innerText = index+1;
    li.href = "#";
    li.appendChild(anchor);
    return li;
  }

  // create new pagination div and append to page div
  const paginationElement = document.createElement('div');
  paginationElement.classList.add('pagination');
  document.querySelector('.page').appendChild(paginationElement);

  // add menu items
  let i = 0;
  while (i < noOfPages) {
    paginationElement.appendChild(newLi(i));
    i++;
  }

  // make first menu item active
  document.querySelector('.pagination li:first-child a').classList.add('active');

  // add event listener to each menu item to show selected page
  const paginationLinks = document.querySelectorAll('.pagination a');
  i = 0;
  while (i < paginationLinks.length){
    paginationLinks[i].addEventListener('click', (e) => {
      const anchor = e.target;
      const index = parseInt(anchor.innerText);

      clearActiveMenuItems();
      setActiveMenuItem(index);

      if(!isNaN(index)){
        showPage(listItemElements, index);
      }
    });
    i++;
  }
}

/*
 * Search list for given search term. Hide irrelevant results and display only matches.
 * @param {string} Search term
 * @return {NodeList} The list of matching students
 */
const search = (searchTerm) => {

    const studentItems = document.querySelectorAll('.student-item');

    studentItems.forEach( (el) => {
      const studentName = el.querySelector('h3').innerText;
      const regexp = new RegExp(searchTerm, 'g');
      // remove all classes
      el.classList.remove('matched');
      el.classList.remove('not-matched');
      // initially hide all students
      el.style.display = '';

      if(studentName.match(regexp)){
        el.classList.add('matched');
      }
      else{
        el.classList.add('not-matched');
      }
    });

    return document.querySelectorAll('.matched');
}

/**
 * Create and add search bar to page
 */
const addSearchBar = () => {

  /*
   * Perform search
   */
  const performSearch = () => {
    const searchInputText = searchInput.value;
    const matchedItems = search(searchInputText);

    // remove not found message if exists
    const notFoundMessage = document.querySelector('.not-found-message');
    if(notFoundMessage){
      notFoundMessage.remove();
    }

    // if matches found then update page navigation and display first page of results
    if(matchedItems.length){
      appendPageLinks();
      showPage(matchedItems, 1);
    }
    // else display a message stating no results have been found
    else{
      const notFoundParagraph = document.createElement('p');
      notFoundParagraph.innerText = "No results found.";
      notFoundParagraph.classList.add('not-found-message');
      document.querySelector('.page').appendChild(notFoundParagraph);

      // hide navigation since there are no results to naviagte through
      const pagination = document.querySelector('.pagination');
      pagination.style.display = 'none';
    }
  }

  const searchBar = document.createElement('div');
  searchBar.classList.add('student-search');

  const searchInput = document.createElement('input');
  searchInput.placeholder = 'Search for students...';

  const searchButton = document.createElement('button');
  searchButton.innerText = "Search";

  searchBar.appendChild(searchInput);
  searchBar.appendChild(searchButton);

  const pageHeader = document.querySelector('.page-header');
  pageHeader.appendChild(searchBar);

  // on button click perform search
  searchButton.addEventListener('click', (el) => {
    performSearch();
  });

  // on keyup click perform search
  searchInput.addEventListener('keyup', (el) => {
    performSearch();
  });
}

// add the page navigation
appendPageLinks();

// add the search bar
addSearchBar();

// show the first page
showPage(listItemElements, 1);