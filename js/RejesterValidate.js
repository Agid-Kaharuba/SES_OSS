$().ready(function() {
    $("#signupForm").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            username: {
                required: true,
                minlength: 2
            },
            password: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            topic: {
                required: "#newsletter:checked",
                minlength: 2
            },
            agree: "required"
        },
        messages: {
            firstname: "Please enter your firstname",
            lastname: "Please enter your lastname",
            username: {
                required: "please enter user name",
                minlength: "Username must consist of two letters"
            },
            password: {
                required: "Please enter your password",
                minlength: "Password cannot be less than 5 letters long"
            },
            confirm_password: {
                required: "Please enter your password again",
                minlength: "Password cannot be less than 5 letters long",
                equalTo: "Inconsistent password input twice"
            },
            email: "Please enter a correct email address",
            agree: "Please accept our statement",
            topic: "Please select two topics"
        }
    })
});