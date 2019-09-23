$().ready(function () {
    $("#signinValidate").validate({
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            },
        },
        messages: {

            password: {
                required: "Please enter your password",
                minlength: "Password cannot be less than 5 letters long"
            },
            email: "Please enter a correct email address",
        }
    })
});
