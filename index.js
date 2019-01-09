console.log($('#result'));

$.ajax('https://fundamentusapi.herokuapp.com/',{
    type: 'GET',
    crossDomain: true
})
    .then(res => {
        console.log(res);
    })
    .catch(err => console.error(err));