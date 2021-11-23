function logout() {
    window.localStorage.removeItem("boschsession");
    window.location.href = '../' //go to products page.
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

$(document).ready(function () {
    $("#cep").mask("99999-999")
    let user = JSON.parse(window.localStorage.getItem("boschsession"));
    if (user) {
        $('#username').text(user.name.split(" ")[0])
        let cart = getCart();
        cart.shipping = 0;
        saveCart(cart);
        loadCart(cart);
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('cat')) {
            let cat = urlParams.get('cat');
            if (cat == 1) {
                $("#catpath").append(" / Ferramentas");
                $("#cat1tab").addClass("selected")
            } else if (cat == 2) {
                $("#catpath").append(" / Acess&oacute;rios");
                $("#cat2tab").addClass("selected")
            }
        }
    } else {
        window.location.href = '../'
    }
});

function shipping() {
    let cep = $("#cep").val()
    if (cep.length == 9) {
        let cart = getCart();
        let fee = 10;
        cart.products.forEach(function (product) {
            fee += 10 * product.quantity;
        });
        if (fee > 10) {
            cart.shipping = fee;
        }
        saveCart(cart);
        loadCart(cart);
    } else {
        $(".error").show();
    }
}

function subItem(index) {
    let cart = getCart();
    cart.products[index].quantity--;
    if (cart.products[index].quantity == 0) {
        cart.products.splice(index, 1);
        if (cart.products.length == 0) {
            cart.shipping = 0;
        }
    }
    saveCart(cart);
    loadCart(cart);
}


function addItem(index) {
    let cart = getCart();
    cart.products[index].quantity++;
    saveCart(cart);
    loadCart(cart);
}

function cartTotalUpdate(cart) {
    let sum = 0;
    cart.products.forEach(function (product) {
        sum += product.price * product.quantity;
    })
    cart.subtotal = sum;
}

function loadCart(cart) {
    $("#cart").empty();
    let template = '<tr>';
    template += '<td><img src="{{path}}"></td>';
    template += '<td>{{desc}}</td>';
    template += '<td><i onclick="subItem({{index}})" class="fas fa-minus"></i>&nbsp;{{quantity}}&nbsp;<i onclick="addItem({{index}})" class="fas fa-plus"></i></td>';
    template += '<td>{{price}}</td>';
    template += '<td>{{total}}</td>';
    template += '</tr>';
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
    cartTotalUpdate(cart);
    $("#subtotal").text(formatter.format(cart.subtotal));
    $("#shipping").text(formatter.format(cart.shipping));
    $("#total").text(formatter.format(cart.subtotal + cart.shipping));
}