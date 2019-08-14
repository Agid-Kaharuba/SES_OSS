function changeText() {
    var person = {
        name: "Krystian",
        age: 21,
        school: {
            name: "UTS",
            address: "Geogore St"
        }
    };
    var attributeNameValue = document.getElementById("attributeName").value;
    document.getElementById('title').innerText = person[attributeNameValue] + " from " + person.school.name;
    document.getElementById('title').style.visibility = 'visible';
}
function hideText(){
    document.getElementById('title').style.visibility ='hidden';
    alert('The text is hidden.');
}

function inputChange(){
    var attributeNameValue = document.getElementById("attributeName").value;
    console.log(attributeNameValue);
}