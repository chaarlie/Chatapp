angular.module('chatApp.common')
	.factory('socket', ['$rootScope', '$location', function ($rootScope, $location) {
		var socket = io.connect();

		return {
			on: function (eventName, callback) {
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
			},
			
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if(callback) {
							callback.apply(socket, args);
						}
					});
				});
			},

			socketStreamEmit: function (eventName, data) {
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
			}
		};
}]);	