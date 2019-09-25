exports.success = function(obj = {}) 
{
    obj['status'] = 'success';
    return obj;
}

exports.fail = function(reason, obj = {}) 
{
    obj['status'] = 'fail';
    obj['reason'] = reason;
    return obj;
}