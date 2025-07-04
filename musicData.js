//========================
//AUDIO VISUALIZER SETUP
//========================

const audioCtx = new AudioContext();
const merge = audioCtx.createChannelMerger();

//set up super quiet mic reader to keep audio running
async function micSetup() {
	try {
		const gain = audioCtx.createGain();
		gain.gain.value = 0.0001;

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const source = audioCtx.createMediaStreamSource(stream);
		source.connect(gain);
		gain.connect(merge);
	} catch (err) {
		console.error(err);
	}
}
micSetup();

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

/*function impulseResponse(duration, decay, reverse) {
	var sampleRate = audioCtx.sampleRate;
	var length = sampleRate * duration;
	var impulse = audioCtx.createBuffer(2, length, sampleRate);
	var impulseL = impulse.getChannelData(0);
	var impulseR = impulse.getChannelData(1);

	if (!decay)
		decay = 2.0;
	for (let i = 0; i < length; i++) {
		var n = reverse ? length - i : i;
		//const l = Math.random() * 2 - 1;
		//const r = Math.random() * 2 - 1;
		const l = 1;
		const r = 1;
		impulseL[i] = l * Math.pow(1 - n / length, decay);
		impulseR[i] = r * Math.pow(1 - n / length, decay);
	}
	return impulse;
}

const convolve = audioCtx.createConvolver();
convolve.buffer = impulseResponse(2, 3, false);
convolve.connect(merge);*/

merge.connect(analyser);
analyser.connect(audioCtx.destination);


//CLASSES

class SongInfo {
	constructor(song, name, col1, col2, bg = SOLID()) {
		this.song = song;
		this.name = name;
		this.col1 = col1;
		this.col2 = col2;
		this.bg = bg;
		this.updateNode();
	}

	updateNode() {
		this.node = new MediaElementAudioSourceNode(audioCtx, { mediaElement: this.song });
		this.node.connect(merge);
	}

	reset() {
		this.song.currentTime = 0;
		this.song.pause();
	}
}

class Track {
	constructor(name, songs) {
		this.songs = songs;
		this.name = name;
	}
}

const marios = new Track("Mario Melodies", [
	new SongInfo(new Audio("musicFiles/SM64 Peach Castle.mp3"), "SM64 Peach's Castle", "#ffbbff", "#ffffcc", ARGYLE("#dddddd", "#6666dd", 30, 45, 1 / 100)),
	new SongInfo(new Audio("musicFiles/Battlerock.mp3"), "Battlerock", "#ff0000", "#3333dd", CIRCLES("darkblue", "darkred", 20, 30)),
	new SongInfo(new Audio("musicFiles/Hell Prominence.mp3"), "Hell Prominence", "#995500", "#cccc00", GRID("orange", "yellow", 10)),
	new SongInfo(new Audio("musicFiles/Buoy Base.mp3"), "Buoy Base", "#aaaaaa", "#440000", SPIRAL("black", "red", 10, 10, 1 / 50, true)),
	new SongInfo(new Audio("musicFiles/Observation Dome.mp3"), "Observation Dome", "#aa8844", "#aaaaff"),
	new SongInfo(new Audio("musicFiles/Space Fantasy.mp3"), "Space Fantasy", "#ff00ff", "#ffaaff", FALLING("#330033", "#551155", 100, 10, 8, true, true)),
	new SongInfo(new Audio("musicFiles/Luma.mp3"), "Luma", "#aaaa66", "#444444", FALLING("black", "yellow", 100, 3, 1)),
	new SongInfo(new Audio("musicFiles/To The Gateway.mp3"), "To The Gateway", "#0000ff", "#111111", ORBITS("darkblue", "yellow", 200, 5, 1)),
	new SongInfo(new Audio("musicFiles/Freezeflame Ice.mp3"), "Freezeflame Ice", "#aaaaff", "#6666bb"),
	new SongInfo(new Audio("musicFiles/Gusty Garden.mp3"), "Gusty Garden", "#44cc55", "#aa7700", HWAVES("darkgreen", "green", 3, 5, 50)),

]);

const minecrafts = new Track("Minecraft Music", [
	new SongInfo(new Audio("musicFiles/Living Mice.mp3"), "Living Mice", "#777777", "#ffccff"),
	new SongInfo(new Audio("musicFiles/Mice On Venus.mp3"), "Mice On Venus", "#ffccaa", "#ff6666", ARGYLE("#774455", "#883300", 10, 8, 1 / 20)),
	new SongInfo(new Audio("musicFiles/Minecraft.mp3"), "Minecraft", "#ffddff", "#ffccbb"),
	new SongInfo(new Audio("musicFiles/Subwoofer Lullaby.mp3"), "Subwoofer Lullaby", "#abf49d", "#c138aa"),
	new SongInfo(new Audio("musicFiles/Sweden.mp3"), "Sweden", "#cccccc", "#ff3333"),
	new SongInfo(new Audio("musicFiles/Haggstrom.mp3"), "Haggstrom", "#aaaaff", "#8888dd", FALLING("#444499", "#ffffff44", 50, 60, 2)),

]);

const animalCrossings = new Track("Animal Crossing Songs", [
	new SongInfo(new Audio("musicFiles/8 AM New Leaf.mp3"), "8 AM New Leaf", "#228822", "#37bd5a"),
	new SongInfo(new Audio("musicFiles/5 AM New Horizons.mp3"), "5 AM New Horizons", "#660066", "#cc6600"),

]);

const celestes = new Track("Celeste Selections", [
	new SongInfo(new Audio("musicFiles/Celeste Level 0.mp3"), "Celeste Level 0", "#aaaaaa", "#553322", HWAVES("#222233", "#444455", 10, 20, 20, 1 / 50)),
	new SongInfo(new Audio("musicFiles/My Dearest Friends.mp3"), "My Dearest Friends", "#ff77ff", "#aa4444"),

]);

const pianos = new Track("Piano Pieces", [
	new SongInfo(new Audio("musicFiles/Moonlight Sonata.mp3"), "Moonlight Sonata", "#000077", "#444444"),
	new SongInfo(new Audio("musicFiles/Clair De Lune.mp3"), "Clair De Lune", "#8800aa", "#9955bb"),
	new SongInfo(new Audio("musicFiles/Wiegenlied.mp3"), "Wiegenlied", "#aadd22", "#66dd33"),
	new SongInfo(new Audio("musicFiles/Dreaming.mp3"), "Dreaming", "#cc9999", "#aaaaaa"),
	new SongInfo(new Audio("musicFiles/Gnossienne.mp3"), "Gnossienne", "#44aa44", "#4444aa"),
	new SongInfo(new Audio("musicFiles/Gymnopedie.mp3"), "Gymnopedie", "#880088", "#888800"),
	new SongInfo(new Audio("musicFiles/Impromptu.mp3"), "Impromptu", "#881111", "#883311"),
	new SongInfo(new Audio("musicFiles/Nocturne.mp3"), "Nocturne", "#004499", "#225588"),
	new SongInfo(new Audio("musicFiles/Reverie.mp3"), "Reverie", "#aa4444", "#aa44aa"),
	new SongInfo(new Audio("musicFiles/Romain.mp3"), "Romain", "#0099dd", "#ddbbbb"),
]);

const tracks = [
	marios,
	minecrafts,
	pianos,
	animalCrossings,
	celestes,
];

for (const track of tracks) {
	for (const songObj of track.songs) {
		songObj.song.loop = true;
	}
}
