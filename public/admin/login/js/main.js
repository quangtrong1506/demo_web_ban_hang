/* =========================================== */
/* =========================================== */
function validate() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password-field').value;
    var settings = {
        url: '/admin/login',
        method: 'POST',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            username: username,
            password: password,
        }),
    };

    $.ajax(settings).done(function (response) {
        if (typeof response != 'object') response = JSON.parse(response);
        if (response.code == 1) {
            swal({
                title: '',
                text: 'Đăng nhập thành công',
                icon: 'success',
                close: true,
                button: false,
            });
            window.location = '/admin';
            return true;
        }
        //Nếu không nhập gì mà nhấn đăng nhập thì sẽ báo lỗi
        if (response.code == -1) {
            swal({
                title: '',
                text: 'Bạn chưa điền đầy đủ thông tin đăng nhập...',
                icon: 'error',
                close: true,
                button: 'Thử lại',
            });

            return false;
        }
        //Nếu không nhập tài khoản sẽ báo lỗi
        if (response.code == -2) {
            swal({
                title: '',
                text: 'Thông tin tài khoản không chính xác',
                icon: 'warning',
                close: true,
                button: 'Thử lại',
            });
            return false;
        }
        if (response.code == -3) {
            swal({
                title: '',
                text: 'Mật khẩu không đúng',
                icon: 'warning',
                close: true,
                button: 'Thử lại',
            });
            return false;
        }
    });

    //Đặt 1 Admin ảo để đăng nhập quản trị
}

/*  PHẦN NỘI DUNG KHÔI PHỤC MẬT KHẨU   */

/* =========================================== */
/* =========================================== */
//  function validate() {
//      var email = document.getElementById("email").value;
//     if (email == null || email == "") {
//        swal("Bạn Chưa Nhập Email", "Vui Lòng Kiểm Tra", "warning");
//        return false;
//    }
//}
function RegexEmail(emailInputBox) {
    var emailStr = document.getElementById(emailInputBox).value;
    if (emailStr.match('@')) {
        var emailRegexStr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        var isvalid = emailRegexStr.test(emailStr);
        if (!isvalid) {
            swal({
                title: '',
                text: 'Bạn vui lòng nhập đúng định dạng email...',
                icon: 'error',
                close: true,
                button: 'Thử lại',
            });
            emailInputBox.focus;
        } else {
            swal({
                title: '',
                text: 'Chúng tôi vừa gửi cho bạn email hướng dẫn đặt lại mật khẩu vào địa chỉ cho bạn',
                icon: 'success',
                close: true,
                button: 'Đóng',
            });
            emailInputBox.focus;
            // window.location = '#';
        }
    } else if (emailStr) {
        if (emailStr.match(/[^0-9]/g) || emailStr.length < 9)
            swal({
                title: '',
                text: 'Số điện thoại hoặc email không hợp lệ',
                icon: 'error',
                close: true,
                button: 'Đóng',
            });
        else
            swal({
                title: '',
                text: 'Chúng tôi vừa gửi cho bạn hướng dẫn đặt lại mật khẩu vào số điện thoại của bạn',
                icon: 'success',
                close: true,
                button: 'Đóng',
            });
        emailInputBox.focus;
    } else {
        swal({
            title: '',
            text: 'Vui lòng nhập đầy đủ thông tin',
            icon: 'error',
            close: true,
            button: 'Đóng',
        });
        emailInputBox.focus;
    }
}
