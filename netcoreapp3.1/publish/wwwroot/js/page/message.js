/**
 * Object JS quản lý các message
 * CreatedBy: NQHIEP (24/07/2020)
 * */
class MessageJS {
    constructor() {

    }

    ///**
    // * Hiển thị message
    // * CreatedBy: NQHIEP (23/07/2020)
    // * */

    showMessage(message) {
        $(".message-box").load('../common/message.html', () => {
            $('.message').append(message);
            $('.message-box').css('opacity', 1);
            $('.message-box').css('visibility', 'visible');
            $('.message').fadeTo(1500, 0).slideUp(100, function () {
                $('.message').hide();
                $('.message-box').css('visibility', 'collapse');
            });
        });
    }
}