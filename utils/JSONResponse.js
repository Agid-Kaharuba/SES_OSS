exports.success = function(obj = {})
{
	obj['status'] = 'success';
	console.trace(obj)
	return obj;
}

exports.fail = function(reason, obj = {})
{
	obj['status'] = 'fail';
	obj['reason'] = reason;
	console.trace(obj);
	return obj;
}
