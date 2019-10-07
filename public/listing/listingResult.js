const ModifyText = "Finish Modifying";

function replaceWithTextInput(id) 
{
    let text = $('#' + id);
    text.replaceWith("<input type='text' id='" + id.replace("Text", "") + "Input" + "' value=" + text.text() + " />")
}


$().ready(() =>
{
    const idIndex = location.pathname.indexOf('=') + 1;
    const listingID = location.pathname.substring(idIndex, location.pathname.length);

    $('#modifyListingBtn').click(() =>
    {
        const btn = $('#modifyListingBtn');
        $('#closeListingBtn').remove();
        $('#purchaseBtn').remove();
        if (btn.text() == ModifyText)
        {
            let listing = {
                id: listingID,
                price: $('#priceInput').val(),
                remainingStock: $('#remainingStockInput').val(),
                description: $('#descriptionArea').val()
            }
            $.post('modify', listing, (response) =>
            {
                console.log(response);
                if (response.status == 'success') 
                {
                    location.reload();
                } 
                else
                {
                    alert("Failed To modify listing!\n" + response.reason);
                }
            });
        }
        else 
        {
            btn.text(ModifyText);
            btn.removeClass("btn-dark");
            btn.addClass("btn-success");
            replaceWithTextInput("priceText");
            replaceWithTextInput("remainingStockText");

            const descPara = $('#descriptionParagraph');
            descPara.replaceWith("<textarea id='descriptionArea' rows='40' class='p-4' style='border: none;'>" + descPara.text() + "</textarea>")
        }
    })

    $('#closeListingBtn').click(() =>
    {
        $.post('modify', {id: listingID, isActive: false}, (response) =>
        {
            if (response.status == 'success')
            {
                location.reload();
            } 
            else 
            {
                alert("Failed To modify listing!\n" + response.reason);
            }
        })
    })

    $('#openListingBtn').click(() =>
    {
        $.post('modify', {id: listingID, isActive: true}, (response) =>
        {
            if (response.status == 'success')
            {
                location.reload();
            } 
            else 
            {
                alert("Failed To modify listing!\n" + response.reason);
            }
        })
    })
})