(function () {
    'use strict';

    var treeviewMenu = $('.app-menu');

    // Toggle Sidebar
    $('[data-toggle="sidebar"]').click(function (event) {
        event.preventDefault();
        $('.app').toggleClass('sidenav-toggled');
    });

    // Activate sidebar treeview toggle
    $("[data-toggle='treeview']").click(function (event) {
        event.preventDefault();
        if (!$(this).parent().hasClass('is-expanded')) {
            treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
    });

    // Set initial active toggle
    $("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');
})();
function time() {
    var today = new Date();
    var weekday = new Array(7);
    weekday[0] = 'Chủ Nhật';
    weekday[1] = 'Thứ Hai';
    weekday[2] = 'Thứ Ba';
    weekday[3] = 'Thứ Tư';
    weekday[4] = 'Thứ Năm';
    weekday[5] = 'Thứ Sáu';
    weekday[6] = 'Thứ Bảy';
    var day = weekday[today.getDay()];
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    nowTime = h + ' giờ ' + m + ' phút ' + s + ' giây';
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = day + ', ' + dd + '/' + mm + '/' + yyyy;
    tmp = '<span class="date"> ' + today + ' - ' + nowTime + '</span>';
    document.getElementById('clock').innerHTML = tmp;
    clocktime = setTimeout('time()', '1000', 'Javascript');

    function checkTime(i) {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
    }
}
if (document.querySelector('#addNhaCungCap .btn-save'))
    document.querySelector('#addNhaCungCap .btn-save').onclick = async function () {
        var name = document.querySelector('#addNhaCungCap .input-name').value.trim();
        var address = document.querySelector('#addNhaCungCap .input-address').value.trim();
        var description = document.querySelector('#addNhaCungCap .input-description').value.trim();
        if (name.length > 0) {
            var settings = {
                url: '/api/add-supplier',
                method: 'POST',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    name: name,
                    description: description,
                    address: address,
                }),
            };
            $.ajax(settings).done(function (data, status) {
                console.log('🚀 ~ file: main.js:82 ~ data', data);
                alert(data.message);
                if (data.status != 401) {
                    document.querySelector('#addNhaCungCap .input-name').value = '';
                    document.querySelector('#addNhaCungCap .input-address').value = '';
                    document.querySelector('#addNhaCungCap .input-description').value = '';
                    var ul = document.querySelector('#addNhaCungCap .list-ncc');
                    if (!ul) return window.location.reload();
                    var li = document.createElement('li');
                    li.innerHTML = name;
                    ul.appendChild(li);
                    var select = document.querySelector('#input-supplier');
                    var option = document.createElement('option');
                    option.innerHTML = name;
                    option.setAttribute('value', name);
                    select.appendChild(option);
                }
            });
        } else alert('Vui lòng nhập tên nhà cung cấp');
    };
if (document.querySelector('#adddanhmuc .btn-save'))
    document.querySelector('#adddanhmuc .btn-save').onclick = async function () {
        var name = document.querySelector('#adddanhmuc .input-name').value.trim();
        var description = document.querySelector('#adddanhmuc .input-description').value.trim();
        if (name.length > 0) {
            var settings = {
                url: '/api/add-categories',
                method: 'POST',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    name: name,
                    description: description,
                }),
            };
            $.ajax(settings).done(function (data, status) {
                alert(data.message);
                if (data.status != 401) {
                    document.querySelector('#adddanhmuc .input-name').value = '';
                    document.querySelector('#adddanhmuc .input-description').value = '';
                    //? thêm vào list
                    var ul = document.querySelector('#adddanhmuc .list-dm');
                    if (!ul) return window.location.reload();
                    var li = document.createElement('li');
                    li.innerHTML = name;
                    ul.appendChild(li);
                    //select-categories
                    //? Thêm vào select
                    var select = document.querySelector('#input-categories');
                    var op = document.createElement('option');
                    op.setAttribute('value', name);
                    op.innerHTML = name;
                    select.appendChild(op);
                }
            });
        } else alert('Vui lòng nhập tên danh mục');
    };
if (document.querySelector('#addtinhtrang .btn-save'))
    document.querySelector('#addtinhtrang .btn-save').onclick = function () {
        var name = document.querySelector('#addtinhtrang .input-name').value.trim();
        var description = document.querySelector('#addtinhtrang .input-description').value.trim();
        if (name.length > 0) {
            var settings = {
                url: '/api/add-item-status',
                method: 'POST',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    name: name,
                    description: description,
                }),
            };
            $.ajax(settings).done(function (data, status) {
                alert(data.message);
                if (data.status != 401) {
                    document.querySelector('#addtinhtrang .input-name').value = '';
                    document.querySelector('#addtinhtrang .input-description').value = '';
                    var ul = document.querySelector('#addtinhtrang .list-item-status');
                    if (!ul) return window.location.reload();
                    var li = document.createElement('li');
                    li.innerHTML = name;
                    ul.appendChild(li);

                    //? Thêm vào select
                    var select = document.querySelector('#input-status');
                    var op = document.createElement('option');
                    op.setAttribute('value', name);
                    op.innerHTML = name;
                    select.appendChild(op);
                }
            });
        } else alert('Vui lòng nhập tên trạng thái');
    };

function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',');
    const byteString =
        splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
}

function getBase64Image(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
}
function ConvertImgToBase64(imageOld) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function () {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        context.drawImage(this, 0, 0);
        var dataURL = canvas.toDataURL('image/jpeg');
        imageOld.src = dataURL;
    };
    image.src = imageOld.src;
}

function onChangeQuantity(event) {
    var value = event.target.value;
    var i = document.querySelector('#input-status');
    var arr = i.options;
    var text = i.value;
    if (i.value != 'Ngừng kinh doanh') {
        for (let i = 0; i < arr.length; i++) {
            arr[i].cl;
            const element = arr[i];
            if (value == 0) {
                text = 'Hết hàng';
            } else if (value < 10) {
                text = 'Sắp hết hàng';
            } else if (value >= 10) {
                text = 'Còn hàng';
            }
            arr[i].removeAttribute('selected');
            if (element.text == text) arr[i].setAttribute('selected', 'selected');
        }
    }
}

function onChangeSalePrice() {
    var salePrice = document.querySelector('#input-salePrice');
    var price = document.querySelector('#input-price');
    var present = document.querySelector('#presentSale');
    if (!isNaN(salePrice.value) && !isNaN(price.value)) {
        if (price.value > 0) {
            var ps = Math.round((salePrice.value / price.value) * 100);
            present.innerHTML = ps + '%';
        } else present.innerHTML = 0 + '%';
    }
}
