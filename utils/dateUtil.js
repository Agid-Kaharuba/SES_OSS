exports.convertFromHTML = function(dateString)
{
    if (dateString === undefined || dateString === null)
    {
        return dateString;
    } 
    else if (typeof dateString !== 'string') 
    {
        console.trace("Expected a string from dateString, but got ", dateString);
        return new Date();
    }
    let dateList = dateString.split('-');
    console.log(dateList);
    return new Date(dateList[0], parseInt(dateList[1]) - 1, dateList[2]);
}

exports.fillPropertyFromHTML = function(obj, key)
{
    obj[key] = this.convertFromHTML(obj[key]);
}

exports.convertToMySQLDatetime = function(date) 
{
    return date.toISOString().slice(0, 19).replace('T',' ');
}