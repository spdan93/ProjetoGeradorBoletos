$(document).ready(function () {
    $('#logInButton').click(function () {
        var login = $('#login').val();
        var password = $('#password').val();

        if (login.length > 0 && password.length > 0) {
            validateLogin(login, password);
        }
    });

    function validateLogin(login, password) {
        var parameters = {
            user: login,
            pass: password
        }

        $.ajax({
            data: {
                function: "getInSite",
                data: parameters
            },
            success: function (res) {
                let response = JSON.parse(res);
                if(response.status === 'success') {
                    sessionStorage.setItem("strLoginToken", response.token);
                    window.location.href = "../view/index.html";
                } else {
                    console.log('não entrou');
                }
            }
        });
    }

    loggedWithToken();
});

function loggedWithToken() {
    if (sessionStorage.getItem("strLoginToken")) {
        window.location.href = "../view/index.html";
    }
}