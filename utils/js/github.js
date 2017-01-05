jQuery.githubUser = function(username, callback) {
   jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback)
}

var headerprep = function () {
	var headerText = '';
	headerText += '<tr>';
	headerText += '<th width="20%" align="left">Name</th>';
	headerText += '<th width="10%" align="left">Language</th>';
	headerText += '<th width="15%" align="left">Updated</th>';
	headerText += '<th width="55%" align="left">Description</th>';
	headerText += '</tr>';
	return headerText;
}
var padfunc = function(value) {
	if (value < 10) {
		return "0"+value.toString();
	} else {
		return value.toString();
	}
}

Date.prototype.rfmt = function() {
	var ystr = this.getFullYear().toString();
	var mstr = padfunc(this.getMonth()+1);
	var dstr = padfunc(this.getDate()+1);
	this.toStringNoDash = ystr+mstr+dstr;
};

var datehandler = function (datestr) {
	var d = new Date(datestr);
	d.rfmt();
	return d.toStringNoDash;
}
	

jQuery.fn.loadRepositories = function(username) {
	this.html("<span>Querying GitHub for " + username +"'s repositories...</span>");

	var target = this;
	$.githubUser(username, function(data) {
		var repos = data.data;
		sortByRecent(repos);

		var list = $('<table width="100%"></table>');
		target.empty().append(list);
		list.append(headerprep());
		$(repos).each(function() {
			if (this.name != (username.toLowerCase()+'.github.io')) {
				var linkstr = '<a href="'+(this.homepage?this.homepage:this.html_url)+'">' + this.name + '</a>';
				var langstr = (this.language?(this.language):'N/A');
				var updtstr = (this.updated_at?(datehandler(this.updated_at)):'Never');
				var row = $('<tr></tr>');
				row.append('<td>'+linkstr+'</td>');
				row.append('<td>'+langstr+'</td>');
				row.append('<td>'+updtstr+'</td>');
				row.append('<td>'+this.description+'</td>');
			}
			list.append(row);
		});
	});
	function sortByRecent(repos) {
		repos.sort(function(a,b) {
			var d1 = Date.parse(a.updated_at);
			var d2 = Date.parse(b.updated_at);
			return d1-d2;
		});
		repos.reverse();
	}
};
