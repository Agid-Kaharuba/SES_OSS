var path;

if (!document.currentScript.hasAttribute("data-profile-path")) {
    path = './profile/editProfile';
}
else 
{
    path = document.currentScript.getAttribute('data-profile-path');
}

function cleanEmpty(obj) 
{
    for (var key in obj)
    {
        if (obj[key] == "")
            delete obj[key];
    }
}

function replaceWithDateInput(id)
{
    let text = $('#' + id);
    let dateList = text.text().split('/');
    let htmlDateString = dateList.reverse().join('-');
    text.replaceWith("<input type='date' id='" + id + "' value='" + htmlDateString + "' />");
}

function replaceWithTextInput(id) 
{
    let text = $('#' + id);
    text.replaceWith("<input type='text' id='" + id + "' value='" + text.text() + "' />")
}

$().ready(() =>
{
    let editBtn = $("#editProfileBtn");

    editBtn.click(() =>
    {
        // Replace the editBtn text to "Finish Edit" if not editing. Otherwise, send the updated profile data.
        if (editBtn.val() == "Finish Edit")
        {
            let editData = {
                firstName : $("#displayFirstName").val(),
                lastName : $("#displayLastName").val(),
                DOB: $("#displayDOB").val(),
                phoneNumber : $("#displayPhone").val(),
                email : $('#displayEmail').val()
            }


            // Get rid of all values that are an empty string ''
            cleanEmpty(editData);

            $.post(path, editData, (response) =>
            {
                console.log("Got response ", response)
                if (response.status == "success")
                {
                    alert("Edit Successful!");
                    location.reload();
                } 
                else
                {
                    alert("Failed to edit profile!\n\n" + response.reason);
                }
            })
        }
        else
        {
            replaceWithTextInput("displayFirstName");
            replaceWithTextInput("displayLastName");
            replaceWithDateInput("displayDOB");
            replaceWithTextInput("displayPhone");
            replaceWithTextInput("displayEmail");
            editBtn.val("Finish Edit");
        }
    })
})