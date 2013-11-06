(function(window) {
	// General utilities
	var doc = window.document,
			$ = function(selector) {
				var result = doc.querySelectorAll(selector);
				return (result.length > 1) ? result : result[0];
			};

	Node.prototype.on = Node.prototype.addEventListener;
	NodeList.prototype.on = function(type, func, flag) {
		[].forEach.call(this, function(node, index) {
			node.on(type, func, flag);
		});
	};

	// App related code starts here
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new window.AudioContext(),
			position = 0,
			scale = {
				g: 392,
				f: 349.23,
				e: 329.63,
				b: 493.68
			},
			song = 'gfefgg-fff-gbb-gfefggggffgfe---',
			playBtn = $('#play'),
			stopBtn = $('#stop'),
			notes = $('#notes'),
			interval = null;

	playBtn.on('click', function(e) {
		interval = setInterval(play, 1000 / 4);
	}, false);

	stopBtn.on('click', function(e) {
		clearInterval(interval);
	}, false);

	function createOscillator(note) {
		var attack = 10, // in ms
				decay = 250, // in ms
				gainNode = context.createGain(),
				osc =	context.createOscillator(),
				freq = scale[note];

		gainNode.connect(context.destination);
		gainNode.gain.setValueAtTime(0, context.currentTime);
		gainNode.gain.linearRampToValueAtTime(1, context.currentTime + attack / 1000);
		gainNode.gain.linearRampToValueAtTime(0, context.currentTime + decay / 1000);

		osc.frequency.value = freq;
		osc.type = 'square';
		osc.connect(gainNode);
		osc.start(0);

		notes.innerHTML += note;

		setTimeout(function() {
			osc.stop(0);
			osc.disconnect(gainNode);
			gainNode.disconnect(context.destination);
		}, decay);
	}


	function play() {
		var note = song.charAt(position);

		position += 1;
		if(position >= song.length) {
			position = 0;
		}

		if(note) {
			createOscillator(note);
		}
	}

}(this));