$(function(){

	Dropzone.options.dropTarget = {
		url: "/upload",
		init: function() {
			this.on('addedfile', onFileAdded);
		}
	}
});	

function onFileAdded(file) {
	console.log(file);
}


