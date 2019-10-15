function cleanEmpty(obj) 
{
    for (var key in obj)
    {
        if (obj[key] == "")
            delete obj[key];
    }
}

function getDateFromInput(id) {
    let text = $('#' + id );
    return new Date(year, month, day);
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
                phoneNumber : $("#displayPhone").val()
            }


            // Get rid of all values that are an empty string ''
            cleanEmpty(editData);

            $.post('./profile/editProfile', editData, (response) =>
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
            editBtn.val("Finish Edit");
        }
    })
})