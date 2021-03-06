function logout() {
    window.localStorage.removeItem("boschsession");
    window.location.href = '../' //go to products page.
}

function shoppingCart() {
    window.location.href = './cart.html' //go to products page.
}

function cepFocus() {
    $("#cep").focus();
}

$(document).ready(function () {
    $("#cep").mask("99999-999");
    $("#card").mask("9999 9999 9999 9999");
    $("#exp").mask("99/99");
    $("#cvv").mask("999");

    $("#logradouro").focus(cepFocus);
    $("#bairro").focus(cepFocus);
    $("#cidade").focus(cepFocus);
    $("#estado").focus(cepFocus);

    let cart = getCart();


    $("#cep").change(updateAddress)
    if (cart.cep) {
        console.log(cart)
        $("#cep").val(cart.cep.substr(0, 5) + "-" + cart.cep.substr(5, 9));
        updateAddress();
    }

    cartUpdate(cart)



    let user = JSON.parse(window.localStorage.getItem("boschsession"));
    if (user) {
        $('#username').text(user.name.split(" ")[0])
    } else {
        window.location.href = '../'
    }
});



function cartUpdate(cart) {
    $("#cart").empty();
    let template = '<div>';
    template += '<img src="{{path}}">';
    template += '<span>{{desc}} x {{quantity}}</span>';
    template += '<span>Total: {{total}}</span>';
    template += '</div>';
    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    if (cart.products.length < 1) {
        $("#cart").append("<tr><td colspan='5'>Carrinho Vazio</td></tr>")
    }
    cart.products.forEach((item, index) => {
        $("#cart").append(template.replaceAll("{{quantity}}", item.quantity).replaceAll("{{path}}", item.path)
            .replaceAll("{{index}}", index).replaceAll("{{desc}}", item.desc).replaceAll("{{price}}", formatter.format(item.price))
            .replaceAll("{{total}}", formatter.format(item.price * item.quantity)));
    })

    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    cartTotalUpdate(cart);
    $("#subtotal").text(formatter.format(cart.subtotal));

    if (cart.shipping) {
        $("#shipping").text(formatter.format(cart.shipping));
        $("#total").text(formatter.format(cart.subtotal + cart.shipping));
    } else {
        $("#shipping").text("-")
        $("#total").text(formatter.format(cart.subtotal));
    }
}

function cartTotalUpdate(cart) {
    let sum = 0;
    cart.products.forEach(function (product) {
        sum += product.price * product.quantity;
    })
    cart.subtotal = sum;
}

function updateAddress() {
    let cep = $("#cep").val();
    console.log(cep)
    cep = cep.replace(/[^0-9]/, "");
    var url = "https://viacep.com.br/ws/" + cep + "/json/";
    $.getJSON(url, function (data) {
        console.log(data)
        try {
            if (!data.erro) {
                $("#logradouro").val(data.logradouro);
                $("#bairro").val(data.bairro);
                $("#cidade").val(data.localidade);
                $("#estado").val(data.uf);
                $("#ceperror").hide();

                let cart = getCart();
                if (data.localidade == "Curitiba") {
                    cart.shipping = 10;
                } else {
                    cart.shipping = 50;
                }
                saveCart(cart);
                cartUpdate(cart);
            } else {
                $("#cep").val("");
                $("#ceperror").show();
            }
        } catch (e) {
            $("#cep").val("");
            $("#ceperror").show();
        }
    });
}

function getCart() {
    let cart = JSON.parse(window.localStorage.getItem("boschCart"));
    if (!cart) {
        cart = {
            "products": [],
            "shipping": 0
        };
        window.localStorage.setItem("boschCart", JSON.stringify(cart));
    }
    return cart;
}

function saveCart(cart) {
    window.localStorage.setItem("boschCart", JSON.stringify(cart));
}