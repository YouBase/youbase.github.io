module.exports = new (function(){
	var me = this;
	this.options = {
		'i1': {style: 'theme-i1', bgSync: ['stephane/**/*'], videoSync: ['**/*']},
		'i2': {style: 'theme-i2', bgSync: ['**/*'], videoSync: ['**/*']}
	};
	this.names = {
	};
	this.colors = 10;
	this.colorClasses = (function(){
		var res = '';
		for(var i=0; i<me.colors; i++){
			var sep = i === 0 ? '' : ' ';
			res += sep + 'colors-'+String.fromCharCode(65+i).toLowerCase();
		}
		return res;
	})();
})();