/**
 * Object JS quản lý các dialog
 * CreatedBy: NQHIEP (10/08/2020)
 * */
class DialogJS {
    constructor() {
        this.initEvent();
    }
    /**
    * Thực hiện gán các sự kiện cho các thành phần trong dialog
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    initEvent() {
        try {


            $(".form-dialog").load('../common/formdialog.html', () => {
                $("#btnClose").click(this.btnCloseOnClick.bind(this));
                $("#btnCloseHeader").click(this.btnCloseHeaderOnClick.bind(this));
                $("#btnSave").on("click", Enum.SaveMode.Save, employeeJs.saveData.bind(employeeJs));
                $('#btnSaveAndAdd').on("click", Enum.SaveMode.SaveAndAdd, employeeJs.saveData.bind(employeeJs));
                $("#changeAvatar").click(() => {
                    $("#upload-avatar").trigger('click');
                });

                $("#removeAvatar").click(() => {
                    $('#avatar').attr('src', "/contents/images/avatar.png");

                })

                $("#upload-avatar").change(this.updateAvatar);

                $("#txtSalary").keyup(this.formatMoneyRealTime);
                document.onkeydown = this.customShortcutKey.bind(this);

            });


            $(".confirm-dialog").load('../common/confirmDialog.html', () => {
                $("#btnAgree").click(this.btnAgree.bind(this));
            });


            $(".delete-dialog").load('../common/deleteDialog.html', () => {
                $("#btnYesDelete").click(this.btnYesDeleteOnClick.bind(this));
                $("#btnNoDelete").click(this.btnNoDeleteOnClick.bind(this));
            });


            $("#closeDialogDetail").load('../common/closeDialog.html', () => {
                $("#btnYes").click(this.btnYesOnClick.bind(this));
                $("#btnNo").click(this.btnNoOnClick.bind(this));
            })


        } catch (e) {
            console.log(e);
        }
    }


    /**
    * Cập nhật avatar
    * CreatedBy: NQHIEP (12/08/2020)
    * */
    updateAvatar() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#avatar').attr('src', e.target.result);
                $('#avatar').css('height', 142);
                $('#avatar').css('width', 132);
            }
            reader.readAsDataURL(this.files[0]);
            employeeJs.avatar = this.files[0];
        } else {
            $('#avatar').attr('src', "/contents/images/avatar.png");
        }
    }


    /**
    * Định nghĩa các phím tắt chức năng
    * CreatedBy: NQHIEP (12/08/2020)
    * */
    customShortcutKey(e) {
        //e.preventDefault();
        var show = $(".form-dialog").css('display');

        if (e.ctrlKey && e.which == 83 && show == 'block') { // ctrl + s
            $("#btnSave").trigger('click');
        } else if (e.ctrlKey && e.shiftKey && e.which == 83 && show == 'block') { // ctrl + shift + s
            $('#btnSaveAndAdd').trigger('click');
        } else if (e.ctrlKey && e.which == 81 && show == 'block') { // ctrl + q
            $("#btnClose").trigger('click');
        } else if (e.which == 27 && show == 'block') { // esc
            $("#btnCloseHeader").trigger('click');
        } else if (e.ctrlKey && e.which == 116) { // ctrl + f5
            location.reload(true);
        }
    }

    /**
    * format tiền khi đièn
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    formatMoneyRealTime() {
        $("#formatMoneyRealTime").val();
    }
    /**
    * sự kiện đồng ý
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnAgree() {
        $("#confirmDialogDetail").hide();
    }
    /**
    * sự kiện xóa
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnYesDeleteOnClick() {
        $("#deleteDialogDetail").hide();
        employeeJs.deleteCustomer();
    }

    /**
    * sự kiện đóng
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnNoDeleteOnClick() {
        $("#deleteDialogDetail").hide();
    }

     ///**
    // * Sự kiện click vào button có
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    btnYesOnClick() {
        $("#cancelDialogDetail").hide();
        this.hideDialog();
    }
    ///**
    // * Sự kiện click vào button không
    // * CreatedBy: NQHIEP (04/08/2020)
    // * */
    btnNoOnClick() {
        $("#cancelDialogDetail").hide();
    }

    ///**
    // * Sự kiện khi điền vào số tiền nợ sẽ format lại số tiền.
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    formatMoneyRealTime() {
        this.value = commonJS.formatMoney(this.value.split('.').join(''));
    }
    ///**
    // * Hiển thị message
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */

    showDialog() {

        $("#formDialogDetail").show();
        $('#txtEmployeeCode').focus();
    }

    ///**
    // * Hiển thị dialog trước khi xóa
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    showDeleteDialog() {
        $("#deleteDialogDetail").show();
        $(".delete-dialog-body-content").empty();
        $(".delete-dialog-body-content").append("Bạn có muốn xóa Nhân viên: " + $(".row-selected")[0].childNodes[1].innerText);
    }


    ///**
    // * Reset các input trước khi hiển thị thêm mới khách hàng
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    resetDialog() {
        $(".dialog input").val("");
        $('#sex').prop('selectedIndex', 0);
        $('#position').prop('selectedIndex', 0);
        $('#department').prop('selectedIndex', 0);
        $('#jobStatus').prop('selectedIndex', 0);
    }
    ///**
    // * Lấy dữ liệu của khách hàng hiển thị lên form dialog khi chỉnh sửa
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    getDataDialog(employeeID) {
        try {
            $.ajax({
                url: "/api/Employees/" + employeeID,
                method: "GET",
                dataType: 'json',
                contentType: 'application/json'
            }).done(function (res) {
                //Gán dữ liệu vào ô input trong dialog
                console.log(res);
                $("#txtEmployeeCode").val(res.employeeCode);
                $("#txtEmployeeName").val(res.employeeName);
                $("#birthday").val(commonJS.reverseDate(commonJS.formatDate(new Date(res.birthday))));
                res.sex < 1 ? $("#sex").val("Nam") : $("#sex").val("Nữ");
                $("#txtEmail").val(res.email);
                $("#txtPhoneNumber").val(res.phoneNumber);
                $("#position").val(res.position);
                $("#department").val(res.department);
                $("#txtSalary").val(res.salary);
                $("#jobStatus").val(res.jobStatus);
            }).fail(function (res) {
                console.log(res);
            })
        } catch (e) {
            console.log(e);
        }

    }
    /**
    * Sự kiện khi click button đóng dưới footer của Dialog
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnCloseOnClick() {

        let formEntered = false;

        $('#formDialog input[type="text"]').each(function () {
            if ($(this).val() !== '') {

                formEntered = true;
            }
        });
        if (formEntered) {
            $('#cancelDialogDetail').show();
        } else {
            this.hideDialog();
        }
    }
    /**
    * Sự kiện khi click button đóng trên tiêu đề của dialog hủy
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnCancelCloseHeader() {
        $('#cancelDialogDetail').hide();
    }
    /**
    * Sự kiện khi click Đóng trên tiêu đề của Dialog
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    btnCloseHeaderOnClick() {
        let formEntered = false;
        if (formEntered) {
            $('#cancelDialogDetail').show();
        } else {
            this.hideDialog();
        }
        //$('#cancelDialogDetail').show();
        //this.hideDialog();
    }
    /**
    * Ẩn dialog
    * CreatedBy: NQHIEP(10/08/2020)
    * */
    hideDialog() {
        $("#formDialogDetail").hide();
    }
}