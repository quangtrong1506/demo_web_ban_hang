(function ($) {
    $(window).on('load', function () {
        $('.loader').fadeOut();
        $('#preloder').delay(200).fadeOut('slow');
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
        updateCart();
    });
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    $('.humberger__open').on('click', function () {
        $('.humberger__menu__wrapper').addClass('show__humberger__menu__wrapper');
        $('.humberger__menu__overlay').addClass('active');
        $('body').addClass('over_hid');
    });

    $('.humberger__menu__overlay').on('click', function () {
        $('.humberger__menu__wrapper').removeClass('show__humberger__menu__wrapper');
        $('.humberger__menu__overlay').removeClass('active');
        $('body').removeClass('over_hid');
    });

    /*------------------
		Navigation
	--------------------*/
    $('.mobile-menu').slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true,
    });

    /*-----------------------
        Categories Slider
    ------------------------*/
    $('.categories__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: [
            "<span class='fa fa-angle-left'><span/>",
            "<span class='fa fa-angle-right'><span/>",
        ],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            },
        },
    });

    $('.hero__categories__all').on('click', function () {
        $('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $('.latest-product__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: [
            "<span class='fa fa-angle-left'><span/>",
            "<span class='fa fa-angle-right'><span/>",
        ],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $('.product__discount__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            },
        },
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    $('.product__details__pic__slider').owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = $('.price-range'),
        minamount = $('#minamount'),
        maxamount = $('#maxamount'),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function (event, ui) {
            var max = parseInt(ui.values[1]) * 1000;
            max = new Intl.NumberFormat('vi-VN').format(max);
            var min = parseInt(ui.values[0]) * 1000;
            min = new Intl.NumberFormat('vi-VN').format(min);
            minamount.val(min);
            maxamount.val(max);
        },
    });
    // minamount.val(
    //   new Intl.NumberFormat("vi-VN").format(rangeSlider.slider("values", 0))
    // );
    // maxamount.val(
    //   new Intl.NumberFormat("vi-VN").format(rangeSlider.slider("values", 1)) +
    //     ".000"
    // );
    if (document.querySelector('#minamount')) {
        document.querySelector('#minamount').addEventListener('change', function () {
            var min = document.querySelector('#minamount').value;
            var max = document.querySelector('#maxamount').value;
            min = parseInt(min.replace(/[,.\s]/g, ''));
            max = parseInt(max.replace(/[,.\s]/g, ''));
            if (min < max && min > 0) {
                $('.price-range').slider('values', 0, parseInt(min / 1000));
                document.querySelector('#minamount').value = new Intl.NumberFormat('vi-VN').format(
                    min
                );
            } else {
                $('.price-range').slider('values', 0, 0);
                document.querySelector('#minamount').value = new Intl.NumberFormat('vi-VN').format(
                    0
                );
            }
        });
        document.querySelector('#minamount').addEventListener('input', function () {
            var min = document.querySelector('#minamount').value;
            if (min === '' || min === undefined || min === null) min = '0';
            min = parseInt(min.replace(/[,.\s]/g, ''));
            document.querySelector('#minamount').value = new Intl.NumberFormat('vi-VN').format(min);
        });
        document.querySelector('#maxamount').addEventListener('change', function () {
            var min = document.querySelector('#minamount').value;
            var max = document.querySelector('#maxamount').value;
            min = parseInt(min.replace(/[,.\s]/g, ''));
            max = parseInt(max.replace(/[,.\s]/g, ''));
            if (min < max && max < 10000000) {
                $('.price-range').slider('values', 1, parseInt(max / 1000));
                document.querySelector('#maxamount').value = new Intl.NumberFormat('vi-VN').format(
                    max
                );
            } else {
                $('.price-range').slider('values', 1, 0);
                document.querySelector('#maxamount').value = new Intl.NumberFormat('vi-VN').format(
                    10000000
                );
            }
        });
        document.querySelector('#maxamount').addEventListener('input', function () {
            var max = document.querySelector('#maxamount').value;
            if (max === '' || max === undefined || max === null) max = '0';
            max = parseInt(max.replace(/[,.\s]/g, ''));
            document.querySelector('#maxamount').value = new Intl.NumberFormat('vi-VN').format(max);
        });
    }

    /*--------------------------
        Select
    ----------------------------*/
    $('select').niceSelect();

    /*------------------
		Single Product
	--------------------*/
    $('.product__details__pic__slider img').on('click', function () {
        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl,
            });
        }
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            if (document.querySelector('.count-so-luong-co')) {
                let countslco = document.querySelector('.count-so-luong-co').innerHTML;
                countslco = parseInt(countslco);
                var newVal = parseFloat(oldValue) + 1;
                if (newVal > countslco) {
                    showAlert('Bạn đã thêm tối đa sản phẩm mà shop có', '', 'info');
                    newVal = countslco;
                }
            } else {
                var newVal = parseFloat(oldValue) + 1;
            }
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
        if (location.href.match('gio-hang'))
            changeQuantity($button.parent().find('input').attr('id'));
    });
    var url = window.location.pathname,
        urlRegExp = new RegExp(url.replace(/\/$/, '') + '$');
    if (urlRegExp == '/') $('.header__menu a').addClass('active');
    else
        $('.header__menu a').each(function () {
            if (urlRegExp.test(this.href.replace(/\/$/, '')) && urlRegExp != '/') {
                $(this).addClass('active');
            }
        });

    $('.prod-select').each((index, element) => {
        element.addEventListener('click', () => changeCheckProduct());
    });
    if (document.querySelector('#prod-check-all'))
        document.querySelector('#prod-check-all').addEventListener('click', () => {
            let list = $('.prod-select');
            if (document.querySelector('#prod-check-all').checked)
                for (let index = 0; index < list.length; index++) {
                    list[index].checked = true;
                }
            else
                for (let index = 0; index < list.length; index++) {
                    list[index].checked = false;
                }
            changeCheckProduct();
        });

    if (document.getElementById('select-tinh-thanh-pho')) {
        let url = 'https://provinces.open-api.vn/api/';
        // let url ='https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1',
        let settings = {
            url: url,
            method: 'GET',
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            let select = document.getElementById('select-tinh-thanh-pho');
            select.innerHTML =
                '<option data-display="Lựa chọn Tỉnh/Thành phố" value="-1">Chưa lựa chọn</option>';
            var tp = response;
            // var tp = response.data.data;
            for (let i = 0; i < tp.length; i++) {
                const element = tp[i];
                var op = document.createElement('option');
                op.value = element.code;
                op.innerHTML = element.name;
                select.appendChild(op);
            }
            $('.select-tinh-thanh-pho').niceSelect('destroy').niceSelect();
        });
        $(document).on('change', '.select-tinh-thanh-pho', function () {
            let code = document.getElementById('select-tinh-thanh-pho').value;
            let settings = {
                url: 'https://provinces.open-api.vn/api/d/',
                method: 'GET',
                timeout: 0,
            };
            $.ajax(settings).done(function (response) {
                let select = document.getElementById('select-quan-huyen');
                select.innerHTML =
                    '<option data-display="Lựa chọn Quận/Huyện" value="-1">Chưa lựa chọn</option>';
                var tp = response;
                for (let i = 0; i < tp.length; i++) {
                    const element = tp[i];
                    if (element.province_code == code) {
                        var op = document.createElement('option');
                        op.value = element.code;
                        op.innerHTML = element.name;
                        select.appendChild(op);
                    }
                }
                $('.select-quan-huyen').niceSelect('destroy').niceSelect();
                document.getElementById('select-xa-phuong').innerHTML =
                    '<option data-display="Lựa chọn Xã/Phường" value="-1">Chưa lựa chọn</option>';
                $('.select-xa-phuong').niceSelect('destroy').niceSelect();
            });
            let ship = code == 1 ? 30000 : 45000;
            document.querySelector('.tien-ship').innerHTML = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(ship);
            //17.320.000 ₫
            let all = document.querySelector('#tong-tien-hang').innerHTML.replace(/[^0-9]/g, '');
            let tiengiamgia = document.querySelector('#discount').innerHTML.replace(/[^0-9]/g, '');
            all = parseInt(all);
            tiengiamgia = parseInt(tiengiamgia);
            document.querySelector('#tien-thanh-toan').innerHTML = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(all - tiengiamgia + ship);
        });
        $(document).on('change', '.select-quan-huyen', function () {
            let code = document.getElementById('select-quan-huyen').value;
            let settings = {
                url: 'https://provinces.open-api.vn/api/w/',
                method: 'GET',
                timeout: 0,
            };
            $.ajax(settings).done(function (response) {
                let select = document.getElementById('select-xa-phuong');
                select.innerHTML =
                    '<option data-display="Lựa chọn Xã/Phường" value="-1">Chưa lựa chọn</option>';
                var tp = response;
                for (let i = 0; i < tp.length; i++) {
                    const element = tp[i];
                    if (element.district_code == code) {
                        var op = document.createElement('option');
                        op.value = element.code;
                        op.innerHTML = element.name;
                        select.appendChild(op);
                    }
                }
                $('.select-xa-phuong').niceSelect('destroy').niceSelect();
            });
        });
    }
})(jQuery);
function changeCheckProduct() {
    let flag = true;
    let list = $('.prod-select');
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (!element.checked) {
            flag = false;
            break;
        }
    }
    flag
        ? (document.getElementById('prod-check-all').checked = true)
        : (document.getElementById('prod-check-all').checked = false);

    let products = [];
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.checked) {
            let quantity = document.getElementById(element.getAttribute('data-productid')).value;
            products.push({
                productId: element.getAttribute('data-productid'),
                quantity: quantity,
            });
        }
    }
    var settings = {
        url: '/user/check-total-before-checkout',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            products: products,
        }),
    };

    $.ajax(settings).done(function (response) {
        if (response.code > 400) {
            Swal.fire(response.message);
        } else {
            var discount = parseInt(
                document.getElementById('discount-value').getAttribute('data-value')
            );
            if (discount > 0) {
                document
                    .getElementById('discount-value')
                    .setAttribute(
                        'data-code',
                        document.getElementById('discount-input').value.toUpperCase()
                    );
                document
                    .getElementById('thanh-toan-btn')
                    .setAttribute(
                        'value',
                        document.getElementById('discount-input').value.toUpperCase()
                    );
            }
            var pay = response.totalNumber - discount < 0 ? 0 : response.totalNumber - discount;
            var payAll = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(pay);
            document.getElementById('total-all').innerHTML = response.totalText;
            document.getElementById('pay-all').innerHTML = payAll;
        }
    });
}
/*-------------------
		Tùy ý đi
	--------------------- */

function onKeydownPassInput_1(e) {
    if (e.keyCode == 13 && e.which == 13) {
        document.getElementById('password').focus();
    }
}
function closeFormLogin() {
    if (document.querySelector('.login')) document.querySelector('.login').remove();
    document.querySelector('.blur-login').remove();
}

function actionLinkSingUp() {
    var newElement = document.createElement('form');
    newElement.classList = 'form-signup';
    newElement.innerHTML = `
  <h2 class="login-header">Đăng ký</h2>
  <div class="login-signup">
    <input
      id="username"
      class="form-control mr-sm-2"
      type="text"
      placeholder="Email"
      autocomplete="off"
      name="username"
    />
    <input
      id="phone"
      class="form-control mr-sm-2 mt-2"
      type="text"
      placeholder="Số điện thoại"
      autocomplete="off"
      name="phone"
    />
    <input
      id="name-1"
      class="form-control mr-sm-2 mt-2"
      type="text"
      placeholder="Họ & Tên"
      autocomplete="off"
      name="name"
    />
    <input
      id="password"
      class="form-control mr-sm-2 mt-2"
      type="password"
      placeholder="Mật khẩu"
      name="password"
      autocomplete="off"
    />
    <input
      id="pass-input-2"
      class="form-control mr-sm-2 mt-2"
      type="password"
      placeholder="Xác nhận mật khẩu"
      autocomplete="off"
    />
    <span class="message" style="color: red; display: none">Xác nhận mật khẩu không chính xác</span
    >
    <button
      type="button"
      class="btn btn-form mt-2 center--btn dn--btn" onclick="registerAccount()">Đăng ký
    </button>
  </div>
  <div class="action-link mt-3">
    <span class="pb-3" onclick="actionLinkSingIn()">Đăng nhập</span>
  </div>`;
    if (document.querySelector('.login .form-signin'))
        document.querySelector('.login .form-signin').remove();
    document.querySelector('.login').appendChild(newElement);
    if (!document.querySelector('.blur-login')) {
        var x = document.createElement('div');
        x.classList = 'blur-login';
        document.body.appendChild(x);
        x.onclick = function () {
            closeFormLogin();
        };
    }
}
function registerAccount() {
    var emailOrPhone = document.querySelector('#username').value;
    var phone = document.querySelector('#phone').value;
    var name = document.querySelector('#name-1').value;
    var pass = document.querySelector('#password').value;
    var cpass = document.querySelector('#pass-input-2').value;
    var message = document.querySelector('.login-signup .message');
    var form = new FormData();
    form.append('username', emailOrPhone);
    form.append('password', pass);
    form.append('confirm', cpass);
    form.append('phone', phone);
    form.append('name', name);

    var settings = {
        url: '/user/dang-ky',
        method: 'POST',
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: form,
    };

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        console.log(response);
        if (response.code == 401) {
            message.style.display = 'inline-block';
            message.innerHTML = response.message;
        } else {
            actionLinkSingIn();
            var form = document.querySelector('.form-signin .message');
            form.style.display = 'inline-block';
            form.style.color = 'green';
            form.innerHTML = 'Đăng ký thành công';
            document.querySelector('.form-signin #username').value = emailOrPhone;
            document.querySelector('.form-signin #password').value = pass;
        }
    });
}

function actionLinkSingIn() {
    if (document.querySelector('.form-signin')) document.querySelector('.form-signin').remove();
    var newElement = document.createElement('form');
    newElement.classList = 'form-signin';
    newElement.innerHTML = `
  <h2 class="login-header">Đăng nhập</h2>
  <div class="login-signin">
    <input
      id="username"
      class="form-control mr-sm-2"
      type="text"
      placeholder="Phone or email"
      autocomplete="off"
      name="username"
      onkeydown="onKeydownPassInput_1(event)"/>
    <input
      id="password"
      class="form-control mr-sm-2 mt-2"
      type="password"
      placeholder="Password"
      autocomplete="off"
      name="password"/>
    <span class="message" style="color: red; display: none">Mật khẩu không chính xác</span>
    <button
      type="button"
      class="btn btn-form mt-2 center--btn dn--btn" onclick="login()">
      Đăng nhập
    </button>
  </div>
  <div class="action-link mt-3 pb-4">
    <span onclick="actionLinkSingUp()">Đăng ký</span>
    <span onclick="actionLinkForgotPassword()">Quên mật khẩu</span>
  </div>`;
    if (document.querySelector('.login .form-signup'))
        document.querySelector('.login .form-signup').remove();
    if (document.querySelector('.login')) document.querySelector('.login').appendChild(newElement);
    else {
        var x = document.createElement('div');
        x.classList = 'login';
        document.body.appendChild(x);
        x.appendChild(newElement);
    }
}
function login() {
    var emailOrPhone = document.querySelector('#username').value;
    var pass = document.querySelector('#password').value;
    var message = document.querySelector('.form-signin .message');
    var form = new FormData();
    form.append('username', emailOrPhone);
    form.append('password', pass);

    var settings = {
        url: '/user/dang-nhap',
        method: 'POST',
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: form,
    };

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        console.log(response);
        if (response.code == 401) {
            message.style.display = 'inline-block';
            message.style.color = 'red';
            message.innerHTML = response.message;
        } else {
            // reload
            message.style.display = 'inline-block';
            message.style.color = 'green';
            message.innerHTML = response.message;
            console.log('Đăng nhập thành công');
            location.reload();
        }
    });
}

function loginInHeader() {
    if (document.querySelector('.login')) {
        document.querySelector('.login').remove();
    }
    if (!document.querySelector('.blur-login')) {
        var x = document.createElement('div');
        x.classList = 'blur-login';
        document.body.appendChild(x);
        x.onclick = function () {
            closeFormLogin();
        };
    }
    actionLinkSingIn();
}
function actionLinkForgotPassword() {
    var newElement = document.createElement('form');
    newElement.classList = 'form-signup';
    newElement.innerHTML = `
  <h2 class="login-header">Quên mật khẩu</h2>
  <div class="login-forgot">
    <input
      id="username"
      class="form-control mr-sm-2"
      type="text"
      placeholder="Phone or email"
      autocomplete="off"
      onkeydown="onKeydownPassInput_1(event)"/>
    <span class="login__mes-1" style="color: red; display: none">Tài khoản không tồn tại</span>
    <button
      type="button"
      class="btn btn-form mt-2 center--btn dn--btn" onclick="forgotPassword()">
      Xác nhận
    </button>
  </div>
  <div class="action-link mt-3">
    <span class="pb-3" onclick="actionLinkSingIn()">Đăng nhập</span>
  </div>`;
    if (document.querySelector('.login .form-signin'))
        document.querySelector('.login .form-signin').remove();
    document.querySelector('.login').appendChild(newElement);
    if (!document.querySelector('.blur-login')) {
        var x = document.createElement('div');
        x.classList = 'blur-login';
        document.body.appendChild(x);
        x.onclick = function () {
            closeFormLogin();
        };
    }
}
function forgotPassword() {
    var email = document.getElementById('username').value;
    var settings = {
        url: '/user/quen-mat-khau',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            email: email,
        }),
    };

    $.ajax(settings).done(function (response) {
        if (typeof response != 'object') response = JSON.parse(response);
        var icon = response.code == 401 ? 'warning' : 'success';
        Swal.fire({
            title: '',
            text: response.message,
            icon: icon,
            button: {
                confirm: {
                    text: 'Xác nhận',
                    visible: true,
                    closeModal: true,
                },
            },
        });
    });
}

var arrBtnLogin = document.querySelectorAll('.header__top__right__auth span.login--btn');
for (var i = 0; i < arrBtnLogin.length; i++) {
    arrBtnLogin[i].addEventListener('click', loginInHeader);
}

function share(link, title, text) {
    var shareData = {
        title: title,
        text: text,
        url: link,
    };
    navigator.share(shareData);
}

function addToCart(productId, quantity) {
    var settings = {
        url: '/api/add-to-cart',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            productId: productId,
            quantity: quantity,
        }),
    };

    $.ajax(settings).done(function (response) {
        if (typeof response != 'object') response = JSON.parse(response);
        var icon = response.code == 401 ? 'warning' : 'success';
        Swal.fire({
            title: '',
            text: response.message,
            icon: icon,
            button: {
                confirm: {
                    text: 'Xác nhận',
                    visible: true,
                    closeModal: true,
                },
            },
        }).then((confirm) => {
            if (confirm) close();
        });

        function close() {
            if (response.message.match('đăng nhập')) {
                loginInHeader();
            } else if (!response.code) updateCart();
        }
    });
}
function addToCartBtnClick(productId) {
    var quantity = parseInt(document.getElementById('quantity-input').value);
    addToCart(productId, quantity);
}
function buyNow(productId) {
    var quantity = parseInt(document.getElementById('quantity-input').value);
    PostThanhToan2(productId, quantity);
}

function updateCart() {
    var settings = {
        url: '/api/cart-info',
        method: 'POST',
        timeout: 0,
    };

    $.ajax(settings).done(function (response) {
        if (typeof response != 'object') response = JSON.parse(response);
        if (response.code != 401) {
            document.getElementById('cart-count').innerHTML = response.count;
            document.getElementById('cart-price').innerHTML = response.sumText;
        }
    });
}
function huyDH(id) {
    Swal.fire({
        title: 'Bạn xác nhận hủy đơn hàng này',
        icon: 'question',
        html: `<p>Lý do hủy đơn hàng</p>
        <input id="lidohuydonhang" style="width:70%" type="text" placeholder="Tôi không muốn mua hàng nữa">
        `,
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Không hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            var lido = document.getElementById('lidohuydonhang').value;
            var settings = {
                url: '/user/cancel-order',
                method: 'POST',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    id: id,
                    lido: lido,
                }),
            };
            $.ajax(settings).done(function (response) {
                if (typeof response != 'object') response = JSON.parse(response);
                var icon = response.code == 401 ? 'error' : 'success';
                Swal.fire({
                    title: 'Thông báo',
                    icon: icon,
                    html: response.message,
                    focusConfirm: true,
                    confirmButtonText: 'Xác nhận',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (response.message.match('thành công')) return location.reload();
                        if (response.message.match('đăng nhập lại')) loginInHeader();
                    }
                });
            });
        }
    });
}
function confirmDH(id) {
    Swal.fire({
        title: 'Bạn xác nhận hoàn thành đơn hàng',
        icon: 'question',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            var settings = {
                url: '/user/confirm-order',
                method: 'POST',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    id: id,
                }),
            };
            $.ajax(settings).done(function (response) {
                if (typeof response != 'object') response = JSON.parse(response);
                var icon = response.code == 401 ? 'error' : 'success';
                Swal.fire({
                    title: 'Thông báo',
                    icon: icon,
                    html: response.message,
                    focusConfirm: true,
                    confirmButtonText: 'Xác nhận',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (response.message.match('thành công')) return location.reload();
                        if (response.message.match('đăng nhập lại')) loginInHeader();
                    }
                });
            });
        }
    });
}

function showAlert(title, html, icon, callback) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        focusConfirm: true,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (result.isConfirmed) {
            if (callback) callback();
        }
    });
}
