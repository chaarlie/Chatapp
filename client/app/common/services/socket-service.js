(function(){
	angular.module('chatApp.common')
		.factory('Socket', ['$rootScope', '$location', Socket]);

	function Socket($rootScope, $location) {
		var socket = io.connect();

		function on(eventName, callback) {
			function wrapper() {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			}
			
			socket.on(eventName, wrapper);
			
			return function () {
				socket.removeListener(eventName, wrapper);
			};
		};

		function emit(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		};

		//this function is for pic uploading. Could upload general files too
		//I'm using npm socket=stream module.
		function socketStreamEmit(eventName, data) {
			var stream = ss.createStream();

			ss(socket).emit(eventName, stream, {name:data.name, size: data.size});
			
			var blobStream = ss.createBlobReadStream(data.file);
			var size = 0;
			picChunck = 0;
			blobStream.on('data', function(chunk) {
				size += chunk.length;
	            // -> e.g. '42%' 
	            picChunck = Math.floor(size / data.size * 100);
	            $rootScope.$broadcast('picChunck', picChunck);     
		    });
		    
			blobStream.pipe(stream);
			stream = null;
		};

		function clean(){
			socket.removeListener();
		};

		return {
			on: on,
			emit: emit,
			socketStreamEmit: socketStreamEmit,
			clean: clean
		};
	};	
}());
