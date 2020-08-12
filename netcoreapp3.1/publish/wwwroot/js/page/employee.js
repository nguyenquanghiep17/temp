
$(document).ready(function () {
    //load dữ liệu:
    employeeJs = new EmployeeJS();
    dialogJs = new DialogJS();
    messageJs = new MessageJS();
})

/**
 * Object JS quản lý các sự kiện cho trang danh mục nhân viên.
 * */
class EmployeeJS {
    formMode = null;
    employeeID = null;
    arrayEmployee = [];
    employeeNumber = 100;
    totalPage = 0;
    menuMode = 1;
    currentPage = 1;
    interval = null;
    totalEmployee = 0;
    avatar = null;
    constructor() {
        try {
            this.getSize();
            this.loadData();
            this.initEvent();
        } catch (e) {

        }
    }

    /**
     * Thực hiện gán các sự kiện cho các thành phần trong trang
     * CreatedBy: NQHIEP (10/08/2020)
     * */
    initEvent() {
        $("#btnAdd").on("click", Enum.FormMode.Add, this.toolbarItemOnClick.bind(this));
        $("#btnDuplicate").on("click", Enum.FormMode.Duplicate, this.toolbarItemOnClick.bind(this));
        $("#btnEdit").on("click", Enum.FormMode.Edit, this.toolbarItemOnClick.bind(this));
        $("#btnDelete").on("click", Enum.FormMode.Delete, this.toolbarItemOnClick.bind(this));
        $("table").on("click", "tbody tr", 9999999, this.rowOnClick.bind(this));
        $("#open-close-menu").on("click", this.menu.bind(this));
        $("#employeeNumber").change(this.changeEmployeeNumber.bind(this));
        $("#page-next").on("click", this.nextPage.bind(this));
        $("#page-prev").on("click", this.prevPage.bind(this));
        $("#page-first").on("click", this.firstPage.bind(this));
        $("#page-last").on("click", this.lastPage.bind(this));
        $("#refresh").on("click", this.refresh.bind(this));
        $("#currentPage").on("keyup", this.changeCurrentPage.bind(this));


    }


    ///**
    // * Sự kiện khi thay đổi trang 
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    changeCurrentPage(event) {
        if (event.keyCode === 13) {

            if (parseInt($("#currentPage").val()) > this.totalPage) {

            } else {
                this.currentPage = parseInt($("#currentPage").val());
                this.loadData();
            }
        }
    }


    ///**
    // * Sự kiện khi click vào vào nút chuyển refresh
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    refresh() {
        this.currentPage = 1;
        this.getSize();
        $("#currentPage").val(this.currentPage);
        this.loadData();
    }

    ///**
    // * Sự kiện khi click vào vào nút chuyển trang cuối cùng
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    lastPage() {
        this.currentPage = this.totalPage;
        $("#currentPage").val(this.currentPage);
        this.loadData();
    }
    ///**
    // * Sự kiện khi click vào vào nút chuyển trang đầu tiên
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    firstPage() {
        this.currentPage = 1;
        $("#currentPage").val(this.currentPage);
        this.loadData();
    }
    ///**
    // * Sự kiện khi click vào vào nút chuyển trang kế tiếp
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    nextPage() {

        this.currentPage < this.totalPage ? this.currentPage += 1 : this.currentPage = this.currentPage;
        $("#currentPage").val(this.currentPage);
        this.loadData();
    }

    ///**
    // * Sự kiện khi click vào vào nút trở lại trang trước
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    prevPage() {
        console.log('hi');
        this.currentPage > 1 ? this.currentPage -= 1 : this.currentPage = this.currentPage;
        $("#currentPage").val(this.currentPage);
        this.loadData();
    }

    ///**
    // * Sự kiện khi thay đổi giá trị số lượng bản ghi khách hàng
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    changeEmployeeNumber() {
        let currentEmmployee = this;
        $("#employeeNumber option:selected").each(function () {
            currentEmmployee.employeeNumber = $(this).text();
            $("#employeeNumber").blur();
        });
        this.refresh();
    }

    ///**
    // * Sự kiện khi click vào icon menu
    // * CreatedBy: NQHIEP (25/07/2020)
    // * */
    menu() {
        if (this.menuMode == Enum.MenuMode.Open) {
            $(".content").css('width', '100%');
            $(".menu").animate({
                width: 0
            });
            this.menuMode = Enum.MenuMode.Close;
        } else if (this.menuMode == Enum.MenuMode.Close) {
            $(".menu").animate({
                width: 230 
            });
            this.menuMode = Enum.MenuMode.Open;
        }
    }

    ///**
    // * Sự kiện khi click button thêm mới || sửa || xóa
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */
    toolbarItemOnClick(sender) {
        
        try {

            this.formMode = sender.data;
            switch (this.formMode) {
                case Enum.FormMode.Add:
                    messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.AddNew);
                    dialogJs.showDialog();
                    this.setEmployeeCode();
                    dialogJs.resetDialog();
                    break;
                case Enum.FormMode.Edit:
                    messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.Edit);
                    dialogJs.getDataDialog(this.employeeID);
                    dialogJs.showDialog();
                    break;
                case Enum.FormMode.Delete:
                    messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.Delete);
                    dialogJs.showDeleteDialog();
                    break;
                case Enum.FormMode.Duplicate:
                    messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.Duplicate);
                    dialogJs.getDataDialog(this.employeeID);
                    dialogJs.showDialog();
                    break;
                default:
            }
        } catch (e) {
            console.log(e);
        }
    }



    // gán giá trị mặc định cho mã nhân viên
    //CreatedBy: NQHIEP (10/08/2020)
    setEmployeeCode() {
        try {
            $.ajax({
                url: "/api/Employees/maxOfEmployeeCode",
                method: "GET",
                dataType: 'json',
                contentType: 'application/json'
            }).done((res) => {
                console.log(res);
            }).fail(function (res) {

                var length = res.responseText.length;
                var nextCode = parseInt(res.responseText.slice(2, length)) + 1;
                var stringNextCode = nextCode + "";
                for (let i = stringNextCode.length; i < length - 2; i++) {
                    stringNextCode = "0" + stringNextCode;
                }
                stringNextCode = "NV" + stringNextCode;
                $("#txtEmployeeCode").val(stringNextCode);
            })
        } catch (e) {
            console.log(e);
        }
    }


    ///**
    // * Xóa khách hàng đã được chọn
    // * CreatedBy: NQHIEP (10/08/2020)
    // * */

    deleteCustomer() {



        $.ajax({
            url: "/api/Employees/" + this.employeeID,
            method: "DELETE",
        }).done((res) => {
            $("#btnEdit").attr('disabled', 'disabled');
            $("#btnDuplicate").attr('disabled', 'disabled');
            $("#btnDelete").attr('disabled', 'disabled');
            this.refresh();
        }).fail(function (res) {
            console.log(res);
        })
    }


    /**
    * Sự kiện khi click chọn 1 dòng trong table
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    rowOnClick(sender) {
        this.employeeID = $(sender.currentTarget).data('id');
        sender.currentTarget.classList.add("row-selected");
        $(sender.currentTarget).siblings().removeClass("row-selected");
        $("#btnEdit").removeAttr('disabled');
        $("#btnDuplicate").removeAttr('disabled');
        $("#btnDelete").removeAttr('disabled');
    }

    /**
    * Hàm lấy tổng số lượng khách hàng
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    getSize() {
        try {
            $.ajax({
                url: "/api/Employees/sizeOfEmployee",
                method: "GET",
                dataType: 'json',
                contentType: 'application/json',
                async: false,
            }).done((res) => {
                this.totalEmployee = res;
                $(".totalpage").empty();
                this.totalPage = (res < this.employeeNumber) ? 1 : Math.floor(res / this.employeeNumber) + (res % this.employeeNumber == 0 ? 0 : 1);
                $(".totalpage").append(this.totalPage);
            }).fail(function (res) {
                console.log(res);
            })
        } catch (e) {
            console.log(e);
        }
    }

    /**
    * Load dữ liệu
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    loadData() {
        try {
            $.ajax({
                url: "/api/Employees/" + this.currentPage + "/" + this.employeeNumber,
                method: "GET",
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: () => {
                    $("#loading").show();
                }
            }).done((res) => {
                $('#tbListEmployee tbody').empty();
                //Đọc dữ liệu và gen dữ liệu từng nhân viên
                this.arrayEmployee = res;
                
                $("#loading").hide();
                this.stopinterval();
                this.bindData();

            }).fail(function (res) {
                console.log(res);
            })
           
        } catch (e) {
            console.log(e);
        }
        
    }

    bindData() {
        let lengthOfResult = this.arrayEmployee.length;
        let start = 0;
        let sizeOfEmployee = this.employeeNumber;
        this.interval = setInterval(() => {

            for (let i = start; i < start + 33 && i < sizeOfEmployee && i < lengthOfResult; i++) {
                if (i === 0) {
                    $('#tbListEmployee tbody').empty();
                }
                let employeeInfoHTML = commonJS.buildTrHTML(this.arrayEmployee[i]['employeeCode'], this.arrayEmployee[i]['employeeName'], this.arrayEmployee[i]['sex'],
                    this.arrayEmployee[i]['birthday'], this.arrayEmployee[i]['phoneNumber'], this.arrayEmployee[i]['email'], this.arrayEmployee[i]['position'], this.arrayEmployee[i]['department'],
                    this.arrayEmployee[i]['salary'], this.arrayEmployee[i]['jobStatus']);
                var convertHtml = $.parseHTML(employeeInfoHTML)[0];
                $(convertHtml).data("id", this.arrayEmployee[i].employeeId);
                $('table#tbListEmployee tbody').append(convertHtml);
                if (i == sizeOfEmployee - 1) {
                    clearInterval(this.interval);
                }
            }
            start += 33;
        }, 500);

        let startShow = parseInt((this.currentPage - 1) * this.employeeNumber + 1);
        let endShow = parseInt((this.currentPage - 1) * this.employeeNumber + parseInt(this.employeeNumber)) < this.totalEmployee ? parseInt((this.currentPage - 1) * this.employeeNumber + parseInt(this.employeeNumber)) : this.totalEmployee;

        $(".pagination-right").empty();
        $(".pagination-right").append("Hiển thị " + startShow + " - " + endShow +  " trên " + this.totalEmployee + " kết quả");
    }

    stopinterval() {
        try {
            clearInterval(this.interval);
        } catch (e) {
            console.log(e);
        }
        
    }

    /**
    * Validate email
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    validateEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email.toLowerCase());
    }

    /**
    * Validate số điện thoại
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    validatePhoneNumber(phoneNumber) {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        return regex.test(phoneNumber);
    }


    /**
    * Validate dữ liệu trước khi lưu
    * CreatedBy: NQHIEP (10/08/2020)
    * */
    validateInput() {
        let employeeCode = $("#txtEmployeeCode").val();
        let employeeName = $("#txtEmployeeName").val();
        let email = $("#txtEmail").val();
        let phoneNumber = $("#txtPhoneNumber").val();
        let isError = false;

        $(".validate-dialog-body-content").empty();

        if (employeeCode === '') {
            
            $(".validate-dialog-body-content").append('Mã nhân viên không được bỏ trống.');
            $("#confirmDialogDetail").show();
            return true;
        }

        try {
            if (this.formMode != Enum.FormMode.Edit) {
                employeeCode = $("#txtEmployeeCode").val();
                $.ajax({
                    url: "/api/Employees/IsEmployeeCodeExists/" + employeeCode,
                    method: "GET",
                    async: false,
                    contentType: 'application/json'
                }).done(function (res) {
                    if (res) {
                        $(".validate-dialog-body-content").append('Mã nhân viên không được trùng.');
                        $("#confirmDialogDetail").show();
                        isError = true;
                    }
                }).fail(function (res) {
                    console.log(res);
                })
            }


        } catch (e) {
            console.log(e);
        }
        if (employeeName === '') {
            $(".validate-dialog-body-content").append('Tên nhân viên không được bỏ trống');
            $("#confirmDialogDetail").show();
            return true;
        }
        if (email === '') {
            $(".validate-dialog-body-content").append('Email không được bỏ trống');
            $("#confirmDialogDetail").show();
            return true;
        }


        if (this.validateEmail(email) === false) {
            $(".validate-dialog-body-content").append('Email không hợp lệ');
            $("#confirmDialogDetail").show();
            return true;
        }

        if (phoneNumber === '') {
            $(".validate-dialog-body-content").append('Số điện thoại không được bỏ trống');
            $("#confirmDialogDetail").show();
            return true;
        }


        if (this.validatePhoneNumber(phoneNumber) === false) {
            $(".validate-dialog-body-content").append('Số điện thoại không hợp lệ');
            $("#confirmDialogDetail").show();
            return true;
        }


        

        return isError;
    }

    /**
     * Cất dữ liệu
     * CreatedBy: NQHIEP (10/08/2020)
     * */
    saveData(sender) {
        let saveMode = sender.data;
        let employeeCode = $("#txtEmployeeCode").val(),
            employeeName = $("#txtEmployeeName").val(),
            bithday = $("#birthday").val(),
            sex = $("#sex").val(),
            email = $("#txtEmail").val(),
            phoneNumber = $("#txtPhoneNumber").val(),
            position = $("#position").val(),
            department = $("#department").val(),
            txtSalary = $("#txtSalary").val(),
            jobStatus = $("#jobStatus").val();
        // Từ các dữ liệu thu thập được thì build thành object khách hàng (customer)
        let employee = {
            birthday: bithday === "" ? null : bithday,
            department: department,
            email: email,
            employeeCode: employeeCode,
            employeeName: employeeName,
            jobStatus: jobStatus,
            phoneNumber: phoneNumber,
            position: position,
            salary: txtSalary === "" ? 0 : parseInt(txtSalary),
            sex: sex == "Nam" ? 0 : 1
        };
        if (this.validateInput()) {
            return;
        } 
        if (this.formMode == Enum.FormMode.Add) { // sử lí thêm mới khách hàng

            $.ajax({
                url: "/api/Employees",
                data: JSON.stringify(employee),
                method: "POST",
                contentType: 'application/json'
            }).done((res) => {
                messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.AddSuccessed);
                this.refresh();
                // Đóng/ ẩn Form:
                if (saveMode == Enum.SaveMode.Save) {
                    dialogJs.hideDialog();
                } else {
                    dialogJs.hideDialog();
                    dialogJs.showDialog();
                }
            }).fail(function (res) {
                console.log(res);
            })
        } else if (this.formMode === Enum.FormMode.Edit) { // sử lí sửa khách hàng
            employee.employeeID = this.employeeID;
            $.ajax({
                url: "/api/Employees/" + this.employeeID,
                data: JSON.stringify(employee),
                method: "PUT",
                contentType: 'application/json'
            }).done((res) => {
                messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.EditSuccessed);
                this.refresh();
                $("#btnEdit").attr('disabled', 'disabled');
                $("#btnDuplicate").attr('disabled', 'disabled');
                $("#btnDelete").attr('disabled', 'disabled');
                // Đóng/ ẩn Form:
                if (saveMode == Enum.SaveMode.Save) {
                    dialogJs.hideDialog();
                } else {
                    dialogJs.hideDialog();
                    dialogJs.showDialog();
                }
            }).fail(function (res) {
                console.log(res);
            })
        } else if (this.formMode === Enum.FormMode.Duplicate) { // sử lí sửa khách hàng
            $.ajax({
                url: "/api/Employees",
                data: JSON.stringify(employee),
                method: "POST",
                contentType: 'application/json'
            }).done((res) => {
                messageJs.showMessage(Resource.Language[commonJS.LanguageCode].Message.AddSuccessed);
                this.refresh();
                // Đóng/ ẩn Form:
                if (saveMode == Enum.SaveMode.Save) {
                    dialogJs.hideDialog();
                } else {
                    dialogJs.hideDialog();
                    dialogJs.showDialog();
                }
            }).fail(function (res) {
                console.log(res);
            })
        }
    }
}
