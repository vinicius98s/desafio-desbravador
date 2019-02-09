document.addEventListener('DOMContentLoaded', () => {
    const sortedParam = location.search.split('sort=');
    const sortForm = document.querySelector('#sort');

    if(sortedParam.length > 1) {
        sortForm.value = sortedParam[1]
    }
})