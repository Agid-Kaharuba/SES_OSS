function inputName(){
    var attributeNameValue = document.getElementById("attributeName").value;
    var letters = /^[A-Za-z]+$/;
    if(!letters.test(attributeNameValue)) {
        var nameNode = document.getElementById("nameError");
        nameNode.innerText = attributeNameValue + " is not correct.";
        nameNode.style.display = 'block';
    } else {
        document.getElementById("nameError").style.display = 'none';
    }

}

function inputAge(){
    var attributeAgeValue = document.getElementById("attributeAge").value;
    if(attributeAgeValue<18){
        document.getElementById("ageError").style.display = 'block';
    } else{
        document.getElementById("ageError").style.display = 'none';
    }
}

function inputPassword4(){

}