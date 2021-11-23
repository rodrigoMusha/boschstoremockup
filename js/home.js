function logout() {
    window.localStorage.removeItem("boschsession");
    window.location.href = '../' //go to products page.
}

function shoppingCart() {
    window.location.href = './cart.html' //go to products page.
}

function initialLoad() {
    let products = [
        { 'id': 1, 'path': '../images/furadeira.jpg', 'desc': 'Furadeira', 'price': 300, 'cat': 1 },
        { 'id': 2, 'path': '../images/esmerilhadeira.jpg', 'desc': 'Esmerilhadeira', 'price': 400, 'cat': 1 },
        { 'id': 3, 'path': '../images/parafusadeira.jpg', 'desc': 'Kit Parafusadeira', 'price': 450, 'cat': 1 },
        { 'id': 4, 'path': '../images/serra.jpg', 'desc': 'Serra', 'price': 500, 'cat': 1 },
        { 'id': 5, 'path': '../images/parafusadeira2.jpg', 'desc': 'Parafusadeira', 'price': 350, 'cat': 1 },
        { 'id': 6, 'path': '../images/broca.jpg', 'desc': 'Broca', 'price': 100, 'cat': 2 },
        { 'id': 7, 'path': '../images/disco.jpg', 'desc': 'Disco', 'price': 50, 'cat': 2 }
    ];
    window.localStorage.setItem("boschProducts", JSON.stringify(products));
    return products;
}

function getProducts() {
    let products = JSON.parse(window.localStorage.getItem("boschProducts"));
    if (!products) {
        products = initialLoad();
    }
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('cat')) {
        let cat = urlParams.get('cat');
        products = products.filter(function (item) {
            return cat == item.cat;
        })
    }
    return products;
}

function sortProducts(products) {
    if ($('#sortBy').val() == 2) {
        products.sort(function (a, b) {
            return b.price - a.price;
        })
    } else if ($('#sortBy').val() == 3) {
        products.sort(function (a, b) {
            return a.price - b.price;
        })
    } else if ($('#sortBy').val() == 4) {
        products.sort(function (a, b) {
            if (a.desc < b.desc) { return -1; }
            if (a.desc > b.desc) { return 1; }
            return 0;
        })
    }
}
$(document).ready(function () {
    let user = JSON.parse(window.localStorage.getItem("boschsession"));
    if (user) {
        $('#username').text(user.name.split(" ")[0])
        loadProducts(getProducts());
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

function update() {
    var query = $("#search").val().toLowerCase();
    let products = getProducts();
    products = products.filter(function (item) {
        console.log(item.desc.toLowerCase().indexOf(query))
        return item.desc.toLowerCase().indexOf(query) > -1;
    })
    sortProducts(products);
    loadProducts(products);
}

function getProductById(id) {
    return getProducts().filter(function (item) {
        return item.id == id;
    })[0];
}

function addProduct(id) {
    let cart = JSON.parse(window.localStorage.getItem("boschCart"));
    if (!cart) {
        cart = {
            "products": []
        }
    }
    if (!cart.products) {
        cart.products = [];
    }
    let found = false;
    cart.products.forEach(function (product) {
        if (product.id == id) {
            product.quantity++;
            found = true;
        }
    })
    if (!found) {
        let product = getProductById(id);
        product.quantity = 1;
        cart.products.push(product);
    }
    window.localStorage.setItem("boschCart", JSON.stringify(cart));
    $("#buy" + id).text("Adicionando.")
    $("body").addClass("disableInteraction");
    $("#buy" + id).addClass("buying");
    setTimeout(function () {
        $("#buy" + id).append(".");
    }, 500);
    setTimeout(function () {
        $("#buy" + id).append(".");
    }, 1000);

    setTimeout(function () {
        shoppingCart();
        $("body").removeClass("disableInteraction");
        $("#buy" + id).removeClass("buying");
    }, 1500);

}
function loadProducts(products) {
    $("#productContainer").empty();
    let template = '<div onclick="addProduct({{id}}, this)" class="productCard">';
    template += '<img src="{{path}}" />';
    template += '<div><b>{{desc}}</b></div>';
    template += '<div>{{price}}</div>';
    template += '<div id="buy{{id}}"class="buy">Comprar</div>';
    template += '</div>';
    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    if (products.length < 1) {
        $("#productContainer").append("Sinto muito!<br>N&atilde;o encontramos nenhum produto!")
    }
    products.forEach((item) => {
        $("#productContainer").append(template.replaceAll("{{path}}", item.path).replaceAll("{{id}}", item.id)
            .replaceAll("{{desc}}", item.desc).replaceAll("{{price}}", formatter.format(item.price)));
    })
}