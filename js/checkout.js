function logout() {
    window.localStorage.removeItem("boschsession");
    window.location.href = '../' //go to products page.
}

function shoppingCart() {
    window.location.href = './cart.html' //go to products page.
}




$(document).ready(function () {
    $("#cep").mask("99999-999");
    $("#card").mask("9999 9999 9999 9999");
    $("#exp").mask("99/99");
    $("#cvv").mask("999");


    $("#cep").change(function () {
        if (this.value.length == 9) {
            var cep = this.value.replace(/[^0-9]/, "");
            var url = "https://viacep.com.br/ws/" + cep + "/json/";
            $.getJSON(url, function (data) {
                try {
                    $("#logradouro").val(data.logradouro);
                    $("#bairro").val(data.bairro);
                    $("#cidade").val(data.localidade);
                    $("#estado").val(data.uf);
                } catch (e) { }
            });
        }
    })



    let user = JSON.parse(window.localStorage.getItem("boschsession"));
    if (user) {
        $('#username').text(user.name.split(" ")[0])
    } else {
        window.location.href = '../'
    }
});