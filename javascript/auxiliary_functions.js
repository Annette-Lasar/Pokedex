/* ===========================================================
auxiliary functions
============================================================= */
async function fetchURL(url) {
  let requestedURL = await fetch(url);
  return requestedURL;
}

async function changeDatabaseToJson(data) {
  let dataToJson = await data.json();
  return dataToJson;
}

function getBoxId(id) {
  const BOX_ID = document.getElementById(id);
  return BOX_ID;
}

function showOrHideLoadingSpinner(action) {
  const loadingSpinner = getBoxId('loading_spinner');
  if (action === 'show') {
    loadingSpinner.classList.remove('d-none');
  } else if (action === 'hide') {
    loadingSpinner.classList.add('d-none');
  }
}
