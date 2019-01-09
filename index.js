console.log($('#result'));

$.ajax('https://fundamentusapi.herokuapp.com/',{
    type: 'GET',
    async: true,
    xhrFields: { withCredentials: true },
})
    .then(res => {
        console.log(res);
    })
    .catch(err => console.error(err));