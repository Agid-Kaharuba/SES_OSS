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

function submitRegister(){
    var data = {
        username: $("#usernameRegister").val(),
        password: $("#passwordRegister").val(),
        email: $("#emailRegister").val(),
        firstName: $("#firstNameRegister").val(),
        lastName: $("#lastNameRegister").val(),
    };
    $.post("/user/register", data, function(res){
        if(res.status === "success") {
            alert("Congratulations! You have successfully registered.");
        }

    });
}
