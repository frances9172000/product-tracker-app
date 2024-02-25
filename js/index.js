let products = [
    {
        name: "Mega Sardines",
        price: 15
    },

    {
        name: "Ligo",
        price: 15
    },

    {
        name: "shampoo",
        price: 6
    },

    {
        name: "lana",
        price: 5
    },
    {
        name: "cornbeef",
        price: 20
    },
    {
        name: "coffees",
        price: 10
    },
    {
        name: "suka",
        price: 10
    }
];

let addedProduct = [];
let cart = [];

$(document).ready(function() {
    productsHtml(".product");
    itemDelay(".product");
    $(".item")[0].classList.toggle("active");
    eventListener();
});

function findProduct(event) {
    let searchInputVal = $(".search-input").val();
    // productMatch Array, container for martching product
    let productsMatch = [];

    products.forEach(product => {
        let productLetters = product.name.split("");
        let lettersSplit = [];
        let match;

        productLetters.forEach((letter, index) => {
            // Condition: if the current index plus the length of the input is greater than the length of the product, stop.
            // Else, execute this code
            if (index + searchInputVal.length <= productLetters.length) {
                lettersSplit.push({
                    letter: product.name.substr(index, searchInputVal.length),
                    index1: index,
                    index2: searchInputVal.length
                });
            }
        });

        lettersSplit.forEach(letter => {
            if (searchInputVal.toLowerCase() === letter.letter.toLowerCase()) {
                productLetters.splice(
                    letter.index1,
                    letter.index2,
                    `<span class="searched-match">${letter.letter}</span>`
                );
                match = true;
            }
        });

        if (match) {
            if (addedProduct.indexOf(product.name) >= 0) {
                productsMatch.push(
                    productAdded(product, productLetters.join(""))
                );
            } else {
                productsMatch.push(
                    productNotAdded(product, productLetters.join(""))
                );
            }
        }
    });

    // If there are no letters left on input while using backspace, execute
    if (searchInputVal.length === 0  || productsMatch.length === 0) {
        // Clear the productsMatch
        productsMatch = ["No Products Matched."];
    }

    // Add the joined productsMatch Array and insert it to the ".product" class
    $(".searched-product").html(`${productsMatch.join("")}`);

    itemDelay(".product");
}

function eventListener() {
    $(".nav-search").on("click", function() {
        toggleSearchBar();
        $(".searched-product").html("Matched products here.");
    });

    $(".search-close").on("click", function() {
        productsHtml();
        toggleSearchBar();
        itemDelay(".product");
        $(".search-input").val("");
    });

    $(".search-input").on("focus", function() {
        $(".search-bar form").toggleClass("active");
    });

    $(".search-input").on("blur", function() {
        $(".search-bar form").toggleClass("active");
    });

    $(".search-bar form").on("submit", function(e) {
        e.isDefaultPrevented();
    });

    $(".nav-shopping-cart").on("click", function(e) {
        $(e.currentTarget).toggleClass("active");
        $(".added").toggleClass("active");
        $(".content").toggleClass("active");
    });

    $(".search-form").on("keyup", function(e) {
        findProduct(e);
        // Clear productsMatch after html manipulation
        productsMatch = [];
    });
}

function itemDelay(item) {
    jQuery.makeArray($(item)).forEach((productElem, index) => {
        setTimeout(() => {
            $(productElem).addClass("active");
        }, 150 * index);
    });
}

function toggleSearchBar() {
    $(".item").toggleClass("invisible");
    $(".search-bar").toggleClass("active");
}

function productsHtml() {
    let html = products.map(product => {
        if (addedProduct.indexOf(product.name) >= 0) {
            return productAdded(product);
        } else {
            return productNotAdded(product);
        }
    });

    $(".searched-product").html(html.join(""));
}

function addCart(elem) {
    let productName = elem.getAttribute("data-name");

    $(".added").addClass("active");
    $(".nav-shopping-cart").addClass("active");
    $(elem.parentNode).html(`
    <span data-name="${productName}" class="btn-small red remove-cart" onClick="removeCart(this)">Remove <i class="fa fa-times"></i></span>`);
    addToOrder(elem.getAttribute("data-name"));
    addedProduct.push(productName);

    productTotal(() => cart.push(findProductObject(productName)));
}

function removeCart(elem) {
    let productName = elem.getAttribute("data-name");
    $(elem.parentNode).html(
        `<span data-name="${productName}" class="btn-small blue add-cart" onClick="addCart(this)">Add <i class="fa fa-cart-plus"></i></span>`
    );
    addedProduct.forEach((e, i) => {
        if (e === elem.getAttribute("data-name")) {
            addedProduct.splice(i, 1);
        }
    });

    removeToOrder(elem);
    productTotal(() => {
        cart.forEach((product, index) => {
            if (product.name === productName) {
                cart.splice(index, 1);
            }
        });
    });
}

function addToOrder(product) {
    let orderTable = $(".order-table");

    let price = products
        .map(e => {
            if (e.name === product) {
                return e.price;
            }
        })
        .filter(e => e !== undefined)[0];
    let tr = document.createElement("tr");
    $(tr).addClass("row-product");
    if (addedProduct.length === 0) orderTable.html("");
    $(tr).html(`
        <td scope="row">${product}</td>
        <td><input data-name="${product}" data-price="${price}" onKeyup="changePrice(this)" type="number" placeholder="1"></td>
        <td class="product-total-price">${price}</td>
        <td class="product-actual-price">${price}</td>
        <th scope="col"><button data-name="${product}" class="btn-small waves-effect waves-light red btn-sm remove-Added" onClick="removeToOrder(this)"><div class="fa fa-times"></div></button></th>
    `);
    orderTable.append(tr);
    $(".content").addClass("active");
}

function removeToOrder(elem) {
    let rowProduct = $(".row-product");
    let removeBtn = $(".remove-Added");
    let product = $(elem).attr("data-name");

    removeBtn.each(function(index) {
        if ($(this).attr("data-name") === product) {
            let that = this;
            rowProduct.each(function() {
                if (this.contains(that)) {
                    $(this).fadeOut("medium", function() {
                        this.remove();
                    });
                }
            });
        }
    });

    $(".remove-cart").each(function(index) {
        if ($(this).attr("data-name") === product) {
            removeCart(this);
        }
    });

    if (addedProduct.length === 0)
        $(".order-table").html(
            `<tr>
            <td colspan="5"><p>No products Added.</p></td>
        </tr>`
        );
}

function changePrice(elem) {
    let parentsParent = $(elem).parentsUntil($(elem), ".row-product");
    let productName = $(elem).attr("data-name");
    let productPrice = $(elem).attr("data-price");

    $.each(parentsParent.children(), function(e) {
        if ($(this).attr("class") === "product-total-price") {
            if ($(elem).val() === "") {
                $(this).html(`${1 * $(elem).attr("data-price")}`);
            } else {
                $(this).html(`${$(elem).val() * $(elem).attr("data-price")}`);
            }
        }
    });

    productTotal(() => {
        cart.forEach(product => {
            if (product.name === productName) {
                let value = $(elem).val() === "" ? 1 : parseInt($(elem).val());
                product.totalPrice = product.price * value;
            }
        });
    });
}

function productNotAdded(product, letters) {
    let name = typeof letters === "undefined" ? product.name : letters;
    return `<div class="product rounded">
            <h1 class="product-name">${name}</h1>
            <p class="product-price">P ${product.price}.00</p>
            <div class="product-actions">
            <span data-name="${product.name}" class="btn-small blue add-cart" onClick="addCart(this)">Add <i class="fa fa-cart-plus"></i></span>
        </div>
    </div>`;
}

function productAdded(product, letters) {
    let name = typeof letters === "undefined" ? product.name : letters;
    return `<div class="product rounded">
            <h1 class="product-name">${name}</h1>
            <p class="product-price">P ${product.price}.00</p>
            <div class="product-actions">
            <span data-name="${product.name}" class="bbtn-small red remove-cart" onClick="removeCart(this)">Remove <i class="fa fa-times"></i></span>
        </div>
    </div>`;
}

function findProductObject(productName) {
    let productObject;
    products.forEach(product => {
        if (product.name === productName) {
            productObject = {
                ...product,
                totalPrice: product.price
            };
        }
    });

    return productObject;
}

function productTotal(callback) {
    let total = 0;
    callback();

    cart.forEach(e => (total = total + e.totalPrice));
    $(".total-price").html(`Php ${total.toFixed(2)}`);
}
