
var commonJS = {
    LanguageCode: "VI",
    /**
    * Hàm định dạng hiển thị tiền
    * @param {number} money
    * CreatedBy: NQHIEP (20/07/2020)
    */
    formatMoney(money) {
        return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    },

    /**
    * Tạo chuỗi HTML checkbox tương ứng với trư/false
    * @param {boolean} value true: checked
    * CreatedBy: NQHIEP (20/07/2020)
    */
    buildCheckBoxByValue(value) {
        var checkBoxHTML = $(`<input type="checkbox" class="disableCheckbox"/>`);
        if (value) {
            checkBoxHTML = checkBoxHTML.attr("checked", true);
        }
        return checkBoxHTML[0].outerHTML;
    },

    /**
    * Tạo chuỗi HTML ứng với mỗi tr
    * @param {employeeCode, employeeName, sex, birthday, phoneNumber, email, position, department, salary, jobStatus}
    * CreatedBy: NQHIEP (20/07/2020)
    */
    buildTrHTML(employeeCode, employeeName, sex, birthday, phoneNumber, email, position, department, salary, jobStatus) {

        var day = birthday != null ? this.formatDate(new Date(birthday)) : "";
        var _sex = sex < 2 ? "Nam" : "Nữ";
        return `<tr>
            <td>`+ employeeCode+ `</td>
            <td>`+ employeeName + `</td>
            <td>`+ _sex + `</td>
            <td class="align-center">`+ day  + `</td>
            <td>`+ phoneNumber + `</td>
            <td>`+ email + `</td>
            <td>`+ position + `</td>
            <td>`+ department + `</td>
            <td class="align-right">`+ this.formatMoney(salary) + `</td>
            <td>`+ jobStatus + `</td>
        </tr>`;
    },

    /**
     * Hàm định dạng ngày hiển thị (dd/MM/yyyy)
     * @param {any} date
     *  CreatedBy: NQHIEP (20/07/2020)
     */
    formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        month = (month < 10) ? "0" + month : month;
        day = (day < 10) ? "0" + day : day;
        return day + "/" + month + "/" + year;
    },
    /**
    * Hàm định dạng ngày hiển thị (yyyy-mm-dd)
    * @param {sting} date
    *  CreatedBy: NQHIEP (24/07/2020)
    */
    reverseDate(date) {
        return date.split('/').reverse().join('-');
    },

}