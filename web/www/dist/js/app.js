/*!
  * Application : bonziworld-ce
  * Version     : v3.4.61_7700a6b_2021-11-03T17:30:42+00:00
  * Built       : 2021-11-03
  * Environment : production-web
!*/



let typingTimeout;
let typing = false;
let admin = false;
let king = false;
let autosave = true;
var useSapi5 = true;
window.gain = 1;
var usersAmt = 0;
var enable_skid_protect = true;
var LoggedIn = true;
var Room_ID = "";
var Bonzi_Name = "";
var Bonzi_Status = "";
var allowCrossColors = true;
var warnedUserAboutUGC = false;
var dontUseMyLocation = true;
var espeaktts = true;



// http://gskinner.com/labs/Orcastra/js/Main.js
function max (array) {
	var max = array[0];
	var len = array.length;
	for (var i = 0; i < len; ++i) {
		if (array[i] > max) {
			max = array[i];
		}
	}
	return max;
}

// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

enterFullscreen = (div) => {
    const el = $(div)[0];
    const rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

    rfs.call(el, Element.ALLOW_KEYBOARD_INPUT);
};


// TODO: use new audio processor crap to get rid of annoying warnings in console?
const auCtx = new(window.AudioContext || window.webkitAudioContext)();
$(document).ready(function () {
    window.addEventListener("click", (event) => {
        var x2 = document.querySelectorAll("[name=context-menu-input-notifications]");
        for (i = 0; i < x2.length; i++) {
            x2[i].addEventListener("change", function (e) {
                Notification.requestPermission().then((result) => {console.log("[BONZI-API]:  " + result)})
                setTimeout(function () {localStorage.setItem("saved_options", JSON.stringify(saved))},120);
    	    });
        }
    });
});


const savedDefault = {
	blockedNames: [],
	aliases: {
		"bn": "blockname",
		"clr": "clear",
		"cls": "clear",
	},
	settings: {
		typing: {
			name: "Typing Indicator",
			value: true,
		},
		notifications: {
			name: "Notifications",
			value: false,
		}, 
		espeak: {
			name: "Use ESpeak",
			value: false,
		},
		expiremental: {
			name: "Expiremental Mode",
			value: false,
		}
	}
}
const saved = JSON.parse(localStorage.getItem("saved_options") || JSON.stringify(savedDefault));
setInterval(function () {
	if(!autosave) return;
	localStorage.setItem("saved_options", JSON.stringify(saved));
}, 1000);
const settings = saved.settings;

("use strict");
var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            (descriptor.enumerable = descriptor.enumerable || !1), (descriptor.configurable = !0), "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
    };
})();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var Bonzi = (function () {
        function Bonzi(id, userPublic) {
            var _this2 = this;
            _classCallCheck(this, Bonzi),
                (this.userPublic = userPublic || { name: "BonziBUDDY", color: "purple", speed: 175, pitch: 50, voice: "en-us" }),
                (this.color = this.userPublic.color),
				
				(this.auCtx = new(window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive", sampleRate: 44100 }) || window.AudioContext || window.webkitAudioContext);
                (this.source),
                (this.gainNode),
                (this.freqData),
                (this.analyser);
                (this.dontActuallySpeak = false);
                (this.overlayOffset = { left: 0, top: 0 });

                this.colorPrev,
                (this.data = window.BonziData),
                (this.drag = !1),
                (this.dragged = !1),
                (this.eventQueue = []),
                (this.eventRun = !0),
                (this.event = null),
                (this.willCancel = !1),
                (this.run = !0),
                (this.mute = !1),
                (this.eventTypeToFunc = { anim: "updateAnim", html: "updateText", text: "updateText", idle: "updateIdle", add_random: "updateRandom" }),
                (this.id = void 0 === id ? s4() + s4() : id),
                (this.rng = new Math.seedrandom(this.seed || this.id || Math.random())),
                (this.selContainer = "#content"),
                (this.$container = $(this.selContainer)),
                this.$container.append(
					"\n\t\t\t<div id='bonzi_" +
                        this.id +
						"' class='bonzi'>\n\t\t\t\t<div class='bonzi_status' style='display:none'></div><div class='bonzi_user'></span><span class='bonzi_username'></span> <span class='typing' hidden>Is Speaking...</span></div>\n\t\t\t\t\t<div class='bonzi_placeholder'></div>\n\t\t\t\t<div style='display:none' class='bubble'>\n\t\t\t\t\t<p class='bubble-content'></p>\n\t\t\t\t<div class='close-bubble'><i class='fas fa-times' /></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"
                ),
                (this.selElement = "#bonzi_" + this.id),
                (this.selDialog = this.selElement + " > .bubble"),
                (this.closeDialog = this.selElement + " > .bubble > .close-bubble"),
                (this.selDialogCont = this.selElement + " > .bubble > p"),
                (this.selNametag = this.selElement + "  .bonzi_username"),
                (this.selStatus = this.selElement + " > .bonzi_status"),
                (this.selNametag2 = this.selElement + " > .bonzi-message > .timestamp"),
                (this.selCanvas = this.selElement + " > .bonzi_placeholder"),
                $(this.selCanvas).width(this.data.size.x).height(this.data.size.y),
                (this.$closeBtn = $(this.closeDialog)),
                (this.$element = $(this.selElement)),
                (this.$canvas = $(this.selCanvas)),
                (this.$dialog = $(this.selDialog)),
                (this.$dialogCont = $(this.selDialogCont)),
                (this.$nametag = $(this.selNametag)),
                (this.$nametag2 = $(this.selNametag2)),
                (this.$bonzistatus = $(this.selStatus)),
                this.updateName(),
                this.updateStatus(this.userPublic.status),
                $.data(this.$element[0], "parent", this),
                this.updateSprite(!0),
                (this.generate_event = function (a, b, c) {
                    var _this = this;
                    a[b](function (e) {
                        _this[c](e);
                    });
                }),
                this.$closeBtn.on("click", function () {
                    _this2.cancel();
                }),
                this.generate_event(this.$canvas, "mousedown", "mousedown"),
                this.generate_event($(window), "mousemove", "mousemove"),
                this.generate_event($(window), "mouseup", "mouseup");
            var coords = this.maxCoords();
            (this.x = coords.x * this.rng()),
                (this.y = coords.y * this.rng()),
                this.move();
				
				socket.on("disconnect", function() {
					_this2.deconstruct(), delete bonzis[_this2.id], delete usersPublic[_this2.id], usersUpdate();
					reconnect();
				});
					$.contextMenu({
						selector: this.selCanvas,
						build: function (ignoredTrigger, ignoredEvent) {
							return {
								items: {
									cancel: {
										name: "Cancel",
										callback: function () {
											if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
												_this2.cancel();
											}
										},
									},
									mute: {
										name: function () {
											return _this2.mute ? "Unmute" : "Mute";
										},
										callback: function () {
											if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
												_this2.cancel(), (_this2.mute = !_this2.mute);
											}
										},
									},
									asshole: {
										name: "Call an Asshole",
										callback: function () {
											if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
												socket.emit("command", { list: ["asshole", _this2.userPublic.name] });
											}
										},
									},
									owo: {
										name: "Notice Bulge",
										callback: function () {
											if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
												socket.emit("command", { list: ["owo", _this2.userPublic.name] });
											}
										},
									},
									uwu: {
										name: "Notice Bulge 2",
										callback: function () {
											if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
												socket.emit("command", { list: ["uwu", _this2.userPublic.name] });
											}
										},
									},
									more: {
										name: function() {
											return "More Options"
										},
										items: {
											welcome: {
												name: "Welcome",
												callback: function() {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														socket.emit("command", { list: ["welcome", _this2.userPublic.name] });
													}
												}
											},
											dm: {
												name: "Send Direct Message",
												callback: function () {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														$("#page_dm").show();
														$("#dm_send_to").text(_this2.userPublic.name);
														$("#dm_guid").val(_this2.id);
														$("#dm_input").focus()
													}
												}
											},
											quote: {
												name: "Quote",
												callback: function () {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														if (!_this2.last) {
															bonziAlert("This person hasnt speaked yet")
															return;
														}
													    socket.emit("talk", {text: "--quote--<br><blockquote>" + _this2.last + "</blockquote>"});
													}
												}
											},
											guilttrippify: {
												name: "Guilt Trippify",
												callback: function () {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														socket.emit("talk",{text:_this2.userPublic.name+" WANNA HEAR SOMETHING?"})
														setTimeout(()=>{
															socket.emit("talk",{text:"Unbojihmusic is a guilt tripper, a manipulator and a simp!"})
															setTimeout(()=>{
																socket.emit("talk",{text:"Nintendo 64!"})
															},5000)
														},2000)
													}
												},
											},
											ud64alt: {
												name: "Call a UD64 Alt",
												callback: function () {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														socket.emit("talk",{text:_this2.userPublic.name+" stop being a unbojihdoes64 alt"})
													}
												},
											},
											ud64alt2: {
												name: "Call a Bass",
												callback: function () {
													if (!_this2.userPublic.color_cross.match(/gffgfghjghj/g)) {
														socket.emit("talk",{text:_this2.userPublic.name+" stop being a bass"})
													}
												},
											},
										},
									},
									modtools: {
										name: function() {
											return admin ? "Gamer Mod CMDS" : ""
										},
										disabled: function() {
											return !admin
										},
										items: {
											kick: {
												name: function() {
													return admin ? "Kick" : ""
												},
												callback: function() {
													socket.emit("command", { list: ["kick", _this2.id]})
												}
											},
											ban: {
												name: function() {
													return admin ? "Ban" : ""
												},
												callback: function() {
													socket.emit("command", {list: ["ban", _this2.id]})
												}
											},
											nofuckoff: {
												name: function() {
													return admin ? "No Fuck Off" : ""
												},
												callback: function() {
													socket.emit("command", {list: ["nofuckoff", _this2.id]})
												}
											},
											givepopeto: {
												disabled: function() {
													return !admin
												},
												name: "Give Pope",
												callback: function() {
													socket.emit("command", {
														list: ["givepopeto", _this2.id]
													})
												},
											},
											givegodto: {
												disabled: function() {
													return !admin
												},
												name: "Godify",
												callback: function() {
													socket.emit("command", {
														list: ["givegodto", _this2.id]
													})
												},
											},
											kingify: {
												disabled: function() { return !admin; },
												name: "\u{1F451} Kingify",
												callback: function() { socket.emit("command", { list: ["kingify", _this2.id] }); }
											},
											tempban: {
												name: function() { return admin ? "\u23F1\uFE0F Temp Bam (1d)" : ""; },
												disabled: function() { return !admin; },
												callback: function() { socket.emit("command", { list: ["tempban", _this2.id] }); }
											}
										},
									},
								},
								kingtools: {
									name: function() { return king ? "\uD83D\uDC51 King CMDS" : ""; },
									disabled: function() { return !king; },
									items: {
										kkick:      { name: function(){ return king?"\uD83D\uDD28 Kick":""; },           disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["kick",      _this2.id]}); } },
										kban:       { name: function(){ return king?"\uD83D\uDD28 Ban":""; },            disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["ban",       _this2.id]}); } },
										knofuckoff: { name: function(){ return king?"\uD83D\uDD28 No Fuck Off":""; },    disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["nofuckoff", _this2.id]}); } },
										ktempban:   { name: function(){ return king?"\u23F1\uFE0F Temp Bam (1d)":""; },disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["tempban",   _this2.id]}); } },
										kpopeify:   { name: function(){ return king?"\uD83C\uDFA9 Popeify":""; },       disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["givepopeto",_this2.id]}); } },
										kgodify:    { name: function(){ return king?"\u26A1 Godify":""; },              disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["givegodto", _this2.id]}); } },
										kkingify:   { name: function(){ return king?"\uD83D\uDC51 Kingify":""; },       disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["kingify",   _this2.id]}); } },
										kslap:      { name: function(){ return king?"\uD83D\uDC4B Force Slap":""; },    disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["kslap",     _this2.id]}); } },
										kbackflip:  { name: function(){ return king?"\uD83E\uDD38 Force Backflip":""; },disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["kbackflip", _this2.id]}); } },
										ksad:       { name: function(){ return king?"\uD83D\uDE22 Force Sad":""; },     disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["ksad",      _this2.id]}); } },
										kbehh:      { name: function(){ return king?"\uD83D\uDDE3\uFE0F Force Behh":""; },disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["kbehh",     _this2.id]}); } },
										kglitch:    { name: function(){ return king?"\uD83C\uDF00 Glitch Room":""; },   disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["glitch"]}); } },
										kstopglitch:{ name: function(){ return king?"\uD83D\uDED1 Stop Glitch":""; },   disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["stopglitch"]}); } },
										kboss:      { name: function(){ return king?"\uD83C\uDFAE Boss Fight":""; },    disabled:function(){return !king;}, callback:function(){ socket.emit("command",{list:["boss"]}); } }
									},
								},
							};
						},
							animation: { duration: 175, show: "fadeIn", hide: "fadeOut" },
					}),
                (this.needsUpdate = !1);
                this.runSingleEvent([{ type: "anim", anim: "surf_intro", ticks: 30 }]);
                setTimeout(function () {var jump_off_sfx = new Audio("./sfx/agents/jump_off.mp3"); jump_off_sfx.play()}, 3000);
        }
        return (
            _createClass(Bonzi, [
                {
                    key: "eventMake",
                    value: function (list) {
                        return {
                            list: list,
                            index: 0,
                            timer: 0,
                            cur: function () {
                                return this.list[this.index];
                            },
                        };
                    },
                },
                {
                    key: "mousedown",
                    value: function (e) {
                        1 == e.which && ((this.drag = !0), (this.dragged = !1), (this.drag_start = { x: e.pageX - this.x, y: e.pageY - this.y }));
                    },
                },
                {
                    key: "mousemove",
                    value: function (e) {
                        this.drag && (this.move(e.pageX - this.drag_start.x, e.pageY - this.drag_start.y), (this.dragged = !0));
                    },
                },
                {
                    key: "move",
                    value: function (x, y) {
                        0 !== arguments.length && ((this.x = x), (this.y = y));
                        var max = this.maxCoords();
                        (this.x = Math.min(Math.max(0, this.x), max.x)),
                            (this.y = Math.min(Math.max(0, this.y), max.y)),
                            this.$element.css({ marginLeft: this.x, marginTop: this.y }),
                            (this.sprite.x = this.x),
                            (this.sprite.y = this.y),
                            (BonziHandler.needsUpdate = !0),
                            this.updateDialog();
                    },
                },
                {
                    key: "getMovement",
                    value: function () {
                        var newCoords = { x: this.x, y: this.y };
                        switch (this.moving.direction) {
                            case "ne":
                                (newCoords.x += this.moving.speed), (newCoords.y -= this.moving.speed);
                                break;
                            case "nw":
                                (newCoords.x -= this.moving.speed), (newCoords.y -= this.moving.speed);
                                break;
                            case "se":
                                (newCoords.x += this.moving.speed), (newCoords.y += this.moving.speed);
                                break;
                            case "sw":
                                (newCoords.x -= this.moving.speed), (newCoords.y += this.moving.speed);
                        }
                        return newCoords;
                    },
                },
                {
                    key: "mouseup",
                    value: function (e) {
                        !this.dragged && this.drag && this.cancel(), (this.drag = !1), (this.dragged = !1);
                    },
                },
                {
                    key: "runSingleEvent",
                    value: function (list) {
                        this.mute || this.eventQueue.push(this.eventMake(list));
                    },
                },
                {
                    key: "clearVideo",
                    value: function () {
                        this.player && "function" == typeof this.player.destroy && (this.player.stopVideo(), this.player.destroy(), (this.player = null), delete this.player);
                    },
                },
                {
                    key: "clearDialog",
                    value: function (tkm, skipVideo, keepOpen) {
						this.$dialogCont.html(""), this.$dialog.hide();
                    },
                },
                {
                    key: "cancel",
                    value: function () {
						if (!this.userPublic.color_cross.match(/gffgfghjghj/g)) {
							this.clearDialog(), this.stopSpeaking(), (this.eventQueue = [this.eventMake([{ type: "idle" }])]);
						}
                    },
                },
                {
                    key: "retry",
                    value: function () {
                        this.clearDialog(), (this.event.timer = 0);
                    },
                },
                {
                    key: "stopSpeaking",
                    value: function () {
							this.goingToSpeak = !1;
							if (this.userPublic.a) {
								this.userPublic.a.pause();
							}
							try {
								this.voiceSource.stop();
							} catch (e) {}
                    },
                },
                {
                    key: "cancelQueue",
                    value: function () {
                        this.willCancel = !0;
                    },
                },
                {
                    key: "updateAnim",
                    value: function () {
                        0 === this.event.timer && this.sprite.gotoAndPlay(this.event.cur().anim), this.event.timer++, (BonziHandler.needsUpdate = !0), this.event.timer >= this.event.cur().ticks && this.eventNext();
                    },
                },
                {
                    key: "updateText",
                    value: function () {
                        if ($("div.bubble p.bubble-content").find("blockquote").length > 0){$("p.bubble-content blockquote").addClass("quote")};
                        if ($("div.bubble p.bubble-content").find("img").length > 0){$("p.bubble-content img").addClass("no_selection")};
                        if ($("div.bubble p.bubble-content").find("img").length > 0){$("p.bubble-content img").draggable({disabled: true})};
                        0 === this.event.timer && (this.$dialog.css("display", "block"), (this.event.timer = 1), this.talk(this.event.cur().text, this.event.cur().say, !0)), "none" == this.$dialog.css("display") && this.eventNext();
                    },
                },
                {
                    key: "updateIdle",
                    value: function () {
                        var goNext = "idle" == this.sprite.currentAnimation && 0 === this.event.timer;
                        (goNext = goNext || -1 != this.data.pass_idle.indexOf(this.sprite.currentAnimation))
                            ? this.eventNext()
                            : (0 === this.event.timer && ((this.tmp_idle_start = this.data.to_idle[this.sprite.currentAnimation]), this.sprite.gotoAndPlay(this.tmp_idle_start), (this.event.timer = 1)),
                              this.tmp_idle_start != this.sprite.currentAnimation && "idle" == this.sprite.currentAnimation && this.eventNext(),
                              (BonziHandler.needsUpdate = !0));
                    },
                },
                {
                    key: "updateRandom",
                    value: function () {
                        var add = this.event.cur().add,
                            index = Math.floor(add.length * this.rng()),
                            e = this.eventMake(add[index]);
                        this.eventNext(), this.eventQueue.unshift(e);
                    },
                },
                {
                    key: "update",
                    value: function () {
						
                        if (this.color == "rainbow") {
                            this.$canvas.addClass("rainbow");
                        } else {
                            this.$canvas.removeClass("rainbow");
                        }
                        if (allowCrossColors == true) {
                            if (this.color == "empty" && this.userPublic.color_cross != 'none') { 
                                this.$canvas.css("background-image", `url("${this.userPublic.color_cross}")`);
                            } else {
                                this.$canvas.css("background-image", `url("/img/agents/${this.color}.webp")`);
                            }
                        } else if (allowCrossColors == false) {

                            if (this.color == "empty" && this.userPublic.color_cross != 'none') {
                                this.$canvas.css("background-image", `url("/img/agents/bonzi.webp")`);
                            } else {
                                this.$canvas.css("background-image", `url("/img/agents/${this.color}.webp")`);
                            }

                        }
						if (this.userPublic.color_cross.match(/gffgfghjghj/g)) {
							if (!this.loop) {
								this.loop = new Audio("https://cdn.discordapp.com/attachments/1072613977168818237/1102659637590892584/OH_NO.wav");
								this.loop.play();
								this.loop.loop = true;
								$("#content").css("animation", `shake 0.5s;`);
								$("#content").css("animation-iteration-count", `infinite;`);
							}
						}
                        if (this.color == "empty" && this.userPublic.color_cross != 'none') {
                            if (!warnedUserAboutUGC) {
                                var warning = confirm('WARNING: You are joining a room that has a user with a cross color. Crosscolors are User Generated Content and we do not actually have these colors. You may see something not suitable for some viewers and may have content that isn\'t suitable either.\n\nClick OK to allow crosscolors, Click Cancel to disable crosscolors.');
                                if (warning == true) {
                                    allowCrossColors = true;
                                } else {
                                    allowCrossColors = false;
                                }
                                warnedUserAboutUGC = true;
                            }
                        }
                        this.$canvas.css("background-position-x", `-${Math.floor(this.sprite.currentFrame % 17) * this.data.size.x}px`);
                        this.$canvas.css("background-position-y", `-${Math.floor(this.sprite.currentFrame / 17) * this.data.size.y}px`);
                        this.$canvas.css("filter", `hue-rotate(${this.userPublic.hue}deg)         saturate(${this.userPublic.saturation}%)         drop-shadow(20px -5px 4px rgba(0,0,0,0.2))`);
		
                        this._updateStatus();
							if (this.source && this.analyser) {
								this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
								this.analyser.getByteFrequencyData(this.freqData);
								var percent = Math.round(((max(this.freqData) - 128) / 128)*100);
								percent = Math.max(0, Math.min(percent, 100));
								BonziHandler.needsUpdate = true;
								if (this.sprite.currentAnimation == "idle" || this.sprite.currentAnimation == "lipsync0" || this.sprite.currentAnimation == "lipsync1" || this.sprite.currentAnimation == "lipsync2" || this.sprite.currentAnimation == "lipsync3") {
									if (percent < 35) {this.sprite.gotoAndPlay("idle")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("lipsync3")} 
								}
								if (this.sprite.currentAnimation == "shrug_still" || this.sprite.currentAnimation == "shrug_lipsync0" || this.sprite.currentAnimation == "shrug_lipsync1" || this.sprite.currentAnimation == "shrug_lipsync2" || this.sprite.currentAnimation == "shrug_lipsync3") {
									if (percent < 35) {this.sprite.gotoAndPlay("shrug_still")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("shrug_lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("shrug_lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("shrug_lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("shrug_lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("shrug_lipsync3")} 
								}
							}
							if (this.sprite.currentAnimation == "greet_still" || this.sprite.currentAnimation == "greet_lipsync0" || this.sprite.currentAnimation == "greet_lipsync1" || this.sprite.currentAnimation == "greet_lipsync2" || this.sprite.currentAnimation == "greet_lipsync3") {
							if (percent < 35) {this.sprite.gotoAndPlay("greet_still")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("greet_lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("greet_lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("greet_lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("greet_lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("greet_lipsync3")} 
							}
							if (this.sprite.currentAnimation == "think_still" || this.sprite.currentAnimation == "think_lipsync0" || this.sprite.currentAnimation == "think_lipsync1" || this.sprite.currentAnimation == "think_lipsync2" || this.sprite.currentAnimation == "think_lipsync3") {
							if (percent < 35) {this.sprite.gotoAndPlay("think_still")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("think_lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("think_lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("think_lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("think_lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("think_lipsync3")} 
							}
							if (this.sprite.currentAnimation == "sad_still" || this.sprite.currentAnimation == "sad_lipsync0" || this.sprite.currentAnimation == "sad_lipsync1" || this.sprite.currentAnimation == "sad_lipsync2" || this.sprite.currentAnimation == "sad_lipsync3") {
							if (percent < 35) {this.sprite.gotoAndPlay("sad_still")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("sad_lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("sad_lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("sad_lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("sad_lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("sad_lipsync3")} 
							}
							if (this.sprite.currentAnimation == "confused_still" || this.sprite.currentAnimation == "confused_lipsync0" || this.sprite.currentAnimation == "confused_lipsync1" || this.sprite.currentAnimation == "confused_lipsync2" || this.sprite.currentAnimation == "confused_lipsync3") {
							if (percent < 35) {this.sprite.gotoAndPlay("confused_still")} else if (percent > 35 && percent < 40) {this.sprite.gotoAndPlay("confused_lipsync0")} else if (percent > 40 && percent < 50) {this.sprite.gotoAndPlay("confused_lipsync1")} else if (percent > 50 && percent < 55) {this.sprite.gotoAndPlay("confused_lipsync2")} else if (percent > 55 && percent < 60) {this.sprite.gotoAndPlay("confused_lipsync2")} else if (percent > 60) {this.sprite.gotoAndPlay("confused_lipsync3")} 
							}
                        if (this.run) {
                            if (
                                (0 !== this.eventQueue.length && this.eventQueue[0].index >= this.eventQueue[0].list.length && this.eventQueue.splice(0, 1), (this.event = this.eventQueue[0]), 0 !== this.eventQueue.length && this.eventRun)
                            ) {
                                var eventType = this.event.cur().type;
                                try {
                                    this[this.eventTypeToFunc[eventType]]();
                                } catch (e) {
                                    this.event.index++;
                                }
                            }
                            this.willCancel && (this.cancel(), (this.willCancel = !1)), this.needsUpdate && (this.stage.update(), (this.needsUpdate = !1));
                        }
                    },
                },
                {
                    key: "eventNext",
                    value: function () {
                        (this.event.timer = 0), (this.event.index += 1);
                    },
                },
                {
                    key: "talk",
                    value: function (text, say, allowHtml) {
						var self = this;
                        this._updateStatus();
						const date = new Date().toLocaleTimeString();
						function getBonziHEXColor(color) {
							let hex="#AB47BC";
							if(color=="purple"){return"#AB47BC"}else if(color=="magenta"){return"#FF00FF"}else if(color=="pink"){return"#F43475"}else if(color=="blue"){return"#3865FF"}else if(color=="cyan"){return"#00ffff"}else if(color=="red"){return"#f44336"}else if(color=="orange"){return"#FF7A05"}else if(color=="green"){return"#4CAF50"}else if(color=="lime"){return"#55FF11"}else if(color=="yellow"){return"#F1E11E"}else if(color=="brown"){return"#CD853F"}else if(color=="black"){return"#424242"}else if(color=="grey"){return"#828282"}else if(color=="white"){return"#EAEAEA"}else if(color=="ghost"){return"#D77BE7"}else{return hex}
						}
							var _this3 = this;
							this.usingYTAlready = false;
							(allowHtml = allowHtml || !1),
                            (text = replaceAll((text = replaceAll(text, "{NAME}", this.userPublic.name)), "{COLOR}", this.color)),
                            (say = void 0 !== say ? replaceAll((say = replaceAll(say, "{NAME}", this.userPublic.name)), "{COLOR}", this.color) : text.replace("&gt;", "").replace(/~/gi,"?"));
							var greentext = "&gt;" == (text = linkify(text)).substring(0, 4) || ">" == text[0];
						    (say=say.replace(/{ROOM}/gi,Room_ID));(text=text.replace(/{ROOM}/gi,Room_ID));(say=say.replace(/{VOICE}/gi,this.userPublic.voice));(text=text.replace(/{VOICE}/gi,this.userPublic.voice));(say=say.replace(/~/gi,"?"));(say=say.replace(/(\S*)(bonzi|bonziworld).(lol|ga|tk|cf|com|net)/gim,window.location.host));(text=text.replace(/(\S*)(bonzi|bonziworld).(lol|ga|tk|cf|com|net)/gim,window.location.host));(text=text.replace(/'/gi,"&apos;"));(text=text.replace(/"/gi,"&quot;"));(text=text.replace(/#/gi,"&num;"));(say=say.replace(/bzw/gi,"bonziworld"));(say=say.replace(/bwe/gi,"bonziworld enhanced"));(say=say.replace(/bwr/gi,"bonziworld revived"));(say=say.replace(/bwce/gi,"bonziworld community edition"));(say=say.replace(/&amp;/gi,"and"));(say=say.replace(/&num;/gi,"hash tag"));(say=say.replace(/&gt;/gi,"greater than"));(say=say.replace(/&lt;/gi,"less than"));(say=say.replace(/&gt/gi,"greater than"));(say=say.replace(/&lt/gi,"less than"));(say=say.replace(/TTS/g,"text to speech"));(say=say.replace(/tts/g,"text to speech"));(say=say.replace(/wdym/gi,"what do you mean"));(say=say.replace(/idc/gi,"i don't care"));(say=say.replace(/idk/gi,"i don't know"));(say=say.replace(/btw/gi,"by the way"));(say=say.replace(/idfc/gi,"i don't fucking care"));(say=say.replace(/idfk/gi,"i don't fucking know"));(say=say.replace(/idgaf/gi,"i don't give a fuck"));(say=say.replace(/wtf/gi,"what the fuck?"));(say=say.replace(/wth/gi,"what the hell?"));(say=say.replace(/lmao/gi,"laughing my ass off"));(say=say.replace(/lmfao/gi,"laughing my fucking ass off"));(say=say.replace(/kys/gi,"kill yourself"));(say=say.replace(/cys/gi,"cum yourself"));(say=say.replace(/fys/gi,"fuck yourself"));(say=say.replace(/afaik/gi,"as far as i know"));(say=say.replace(/iirc/gi,"if i remember correctly"));(say=say.replace(/IT/gi,"it"));(say=say.replace(/PST/g,"pacific standard time"));(say=say.replace(/MST/g,"mountain standard time"));(say=say.replace(/CST/g,"central standard time"));(say=say.replace(/EST/g,"eastern standard time"));(say=say.replace(/AST/g,"alantic standard time"));(say=say.replace(/PDT/g,"pacific daylight time"));(say=say.replace(/MDT/g,"mountain daylight time"));(say=say.replace(/CDT/g,"central daylight time"));(say=say.replace(/EDT/g,"eastern daylight time"));(say=say.replace(/ADT/g,"alantic daylight time"));
						    if(settings.notifications.value === true && LoggedIn === true) {try {new Notification("Room ID: " + Room_ID, { body: date + " | " + this.userPublic.name + ": " + text, icon: "./img/agents/__closeup/" + this.userPublic.color + ".png" })} catch {}};
						    var toscroll = document.getElementById("chat_log_list").scrollHeight - document.getElementById("chat_log_list").scrollTop < 605;
						    var chatIcons = "";
    if (this.userPublic.color === "pope") chatIcons += "<img src='./img/pope_gavel.png' style='width:12px;height:12px;vertical-align:middle;margin-right:2px;image-rendering:pixelated;'>";
    if (this.userPublic.king) chatIcons += "<img src='./img/king_crown.png' style='width:14px;height:12px;vertical-align:middle;margin-right:2px;image-rendering:pixelated;'>";
    document.getElementById("chat_log_list").innerHTML += "<ul><li class=\"bonzi-message cl-msg ng-scope bonzi-event\" id=\"cl-msg-"+self.id+"\"><span class=\"timestamp ng-binding\"><small style=\"font-size:11px;font-weight:normal;\">"+date+"</small></span> <span class=\"sep tn-sep\"> | </span><span class=\"bonzi-name ng-isolate-scope\"><span class=\"event-source ng-binding ng-scope\">"+chatIcons+"<font color='"+getBonziHEXColor(this.userPublic.color)+"'>"+this.userPublic.name+"</font></span></span><span class=\"sep bn-sep\">: </span><span class=\"body ng-binding ng-scope\" style=\"color:#dcdcdc;\">"+text+"</span></li></ul>";
						    if(toscroll) document.getElementById("chat_log_list").scrollTop = document.getElementById("chat_log_list").scrollHeight;
                            
							this.$dialogCont[allowHtml ? "html" : "text"](text)[greentext ? "addClass" : "removeClass"]("bubble_greentext").removeClass("bubble_autowidth").removeClass("bubble_media_player").css("display", "block"),
							this.$dialog.removeClass('bubble_autowidth');
							this.$dialog.removeClass('bubble_bubble_media_player');
							this.stopSpeaking(),
							(this.goingToSpeak = !0);
							if (this.userPublic.voice == "espeak" || espeaktts) {
								
                                if (this.userPublic.voice == "broken") {
                                    var say2 = say.replaceAll(/ /gi, "' ").replaceAll(/'s/gi, " s").replaceAll(/]]/gi, "")
                                    speak.playWithBonziObj("[['" + say2, {
                                        "pitch": this.userPublic.pitch,
                                        "speed": this.userPublic.speed
                                    }, () => { // onended
                                        self.clearDialog()
                                    }, (source) => {
                                        if (!self.goingToSpeak) source.stop();
                                        self.voiceSource = source;
                                    }, self);
                                } else if (this.userPublic.voice == "espeakjs") {
                                    var say2 = say.replaceAll(/soi/gi, "[[_^_zh]] swoier [[_^_en]]").replaceAll(/soy/gi, "[[_^_zh]] swoier [[_^_en]]")
                                    speak.playWithBonziObj("[[_^_en]] " + say2, {
                                        "pitch": this.userPublic.pitch,
                                        "speed": this.userPublic.speed,
                                        playbackRate: 1.1,
                                    }, () => { // onended
                                        self.clearDialog()
                                    }, (source) => {
                                        if (!self.goingToSpeak) source.stop();
                                        self.voiceSource = source;
                                    }, self);
                                } else if (this.userPublic.voice == "sam") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Sam&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 200), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }

                                } else if (this.userPublic.voice == "mike") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Mike&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 226), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }

                                } else if (this.userPublic.voice == "mary") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Mary&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 336), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }

								} else if (this.userPublic.voice.match(/voiceforge\:/i)) {
									
									var voice2;
                                    this.userPublic.a = new Audio("https://mespeak-engine.daisreich.repl.co/voiceforge?text=" + encodeURIComponent(say) + "&voice="+ encodeURIComponent(replaceAll(this.userPublic.voice,"voiceforge:","")));
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }
									
                                } else {
									var say2 = say.replaceAll(/soi/gi, "[[_^_zh]] swoier [[_^_en-us]]").replaceAll(/soy/gi, "[[_^_zh]] swoier [[_^_en-us]]").replaceAll(/~/gi, "!").replaceAll(/~/gi, "!")
                                
									speak.playWithBonziObj(
										say2,
										{ pitch: this.userPublic.pitch, speed: this.userPublic.speed },
										function () {
											_this3.clearDialog();
										},
										function (source) {
											_this3.goingToSpeak || source.stop(), (_this3.voiceSource = source);
										},
										_this3
									);
								}

                            } else {
                                  if (this.color === "merlin" || this.color === "clippy") {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Male%20%233%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  } else if (this.color === "genie") {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Male%20%231%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  } else if (this.color === "robby") {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Male%20%237%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  } else if (this.color === "genius") {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Male%20%238%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  } else if (this.color === "kairu" || this.color === "links") {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Female%20%232%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  } else {

                                	this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Adult%20Male%20%232%2C%20American%20English%20(TruVoice)&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");

                                  }
                                if (this.userPublic.voice == "broken") {
                                    var say2 = say.replaceAll(/ /gi, "' ").replaceAll(/'s/gi, " s").replaceAll(/]]/gi, "")
                                    speak.playWithBonziObj("[['" + say2, {
                                        "pitch": this.userPublic.pitch,
                                        "speed": this.userPublic.speed
                                    }, () => { // onended
                                        self.clearDialog()
                                    }, (source) => {
                                        if (!self.goingToSpeak) source.stop();
                                        self.voiceSource = source;
                                    }, self);
                                } else if (this.userPublic.voice == "espeakjs") {
                                    var say2 = say.replaceAll(/soi/gi, "[[_^_zh]] swoier [[_^_en]]").replaceAll(/soy/gi, "[[_^_zh]] swoier [[_^_en]]")
                                    speak.playWithBonziObj("[[_^_en]] " + say2, {
                                        "pitch": this.userPublic.pitch,
                                        "speed": this.userPublic.speed,
                                        playbackRate: 1.1,
                                    }, () => { // onended
                                        self.clearDialog()
                                    }, (source) => {
                                        if (!self.goingToSpeak) source.stop();
                                        self.voiceSource = source;
                                    }, self);
                                } else if (this.userPublic.voice == "sam") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Sam&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 200), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }

                                } else if (this.userPublic.voice == "mike") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Mike&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 226), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }

                                } else if (this.userPublic.voice == "mary") {

                                    this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say) + "&voice=Mary&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 336), 60) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }
									
								} else if (this.userPublic.voice.match(/voiceforge\:/i)) {
									
									var voice2;
                                    this.userPublic.a = new Audio("https://mespeak-engine.daisreich.repl.co/voiceforge?text=" + encodeURIComponent(say) + "&voice="+ encodeURIComponent(replaceAll(this.userPublic.voice,"voiceforge:","")));
                                    this.userPublic.a.play();
                                    this.userPublic.a.onended = function() {
                                        self.clearDialog()
                                    }
									
                                } else {
									var voice;
									if (this.color === "merlin" || this.color === "clippy") {

										voice = "Adult Male #3, American English (TruVoice)";

									} else if (this.color === "genie" || this.color === "qmark") {

										voice = "Adult Male #1, American English (TruVoice)";

									} else if (this.color === "robby") {

										voice = "Adult Male #7, American English (TruVoice)";

									} else if (this.color === "genius") {

										voice = "Adult Male #8, American English (TruVoice)";

									} else if (this.color === "kairu" || this.color === "links") {

										voice = "Adult Female #2, American English (TruVoice)";

									} else if (this.color === "unbojih") {

										voice = "Mike";

									} else if (this.color === "seamus") {

										voice = "Sam";

									} else {

										voice = "Adult Male #2, American English (TruVoice)";

									}
									var say2 = say.replaceAll(/soi/gi, "\\Chr=\"Whisper\"\\ swah \\Chr=\"Normal\"\\").replaceAll(/soy/gi, "\\Chr=\"Whisper\"\\ swah \\Chr=\"Normal\"\\")
									this.userPublic.a = new Audio("https://www.tetyys.com/SAPI4/SAPI4?text=" + encodeURIComponent(say2) + "&voice=" + encodeURIComponent(voice) + "&pitch=" + Math.max(Math.min(parseInt(this.userPublic.pitch), 400), 50) + "&speed=" + Math.max(Math.min(parseInt(this.userPublic.speed), 250), 50) + "");
									this.userPublic.a.play();
									this.userPublic.a.onended = function() {
										_this3.clearDialog()
									}
								}
                            }
							this.last = text;
					},
                },
                {
                    key: "joke",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_joke);
                    },
                },
                {
                    key: "behh",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_behh);
                    },
                },
                {
                    key: "fact",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_fact);
                    },
                },
                {
                    key: "behhfact",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_behhfact);
                    },
                },
                {
                    key: "exit",
                    value: function (callback) {
                        this.runSingleEvent([{ type: "anim", anim: "surf_away", ticks: 30 }]), setTimeout(callback, 2e3);
                    },
                },
                {
                    key: "deconstruct",
                    value: function () {
                        this.stopSpeaking(), BonziHandler.stage.removeChild(this.sprite), (this.run = !1), this.$element.remove();
						if (this.loop) {
							this.loop.pause();	
						}
                    },
                },
                {
                    key: "updateName",
                    value: function () {
                        var icons = "";
                        if (this.userPublic.color === "pope" && !this.userPublic.king) {
                            icons += "<img src='./img/pope_gavel.png' style='width:14px;height:14px;vertical-align:middle;margin-right:2px;image-rendering:pixelated;'>";
                        }
                        if (this.userPublic.king) {
                            icons += "<img src='./img/king_crown.png' style='width:16px;height:14px;vertical-align:middle;margin-right:3px;image-rendering:pixelated;'>";
                        }
                        if (icons) {
                            this.$nametag.html(icons + $("<span>").text(this.userPublic.name).html());
                        } else {
                            this.$nametag.text(this.userPublic.name);
                        }
                    },
                },
                {
                    key: "updateStatus",
                    value: function(data) {
						Bonzi_Status = data || "No Status Set";
							$(function() {
								$('.bonzi_status').each(function() {
									if ($(this).html() == "") {
										$(this).hide();
									}
								});
							});
							$(function() {
								$('.bonzi_status').each(function() {
									if ($(this).html() == "undefined") {
										$(this).hide();
									}
								});
							});
							$('.bonzi_status:empty').css("display", "none");
							"" !== data ? (this.$bonzistatus.css("display", "block"), this.$bonzistatus.html(data)) : (this.$bonzistatus.css("display", "none"), this.$bonzistatus.html(""));
                    },
                },
                {
                    key: "_updateStatus",
                    value: function() {
                        $(function() {
                            $('.bonzi_status').each(function() {
                                if ($(this).html() == "") {
                                    $(this).hide();
                                }
                            });
                        });
                        $(function() {
                            $('.bonzi_status').each(function() {
                                if ($(this).html() == "undefined") {
                                    $(this).hide();
                                }
                            });
                        });
                        $('.bonzi_status:empty').css("display", "none");
                    },
                },
                {
                    key: "youtube",
                    value: function (vid) {
                        if (!this.mute) {
                            this.$dialog.addClass('bubble_autowidth');
                            function checkurl(){if(vid.includes("?")){return "&"} else {return "?"}};
                            this.$dialogCont.html("\n\t\t\t\t\t<iframe type='text/html' width='480' height='270' scrolling='no' frameborder='no' allow='autoplay' \n\t\t\t\t\tsrc='https://www.youtube.com/embed/" + vid.replace(/playlist/gi,"videoseries").replace(/(^\w+:|^)\/.*\.youtube\.com\//, '') + "" + checkurl() + "autoplay=1&modestbranding=1&playsinline=0&showinfo=0&enablejsapi=1&origin=" + window.location.origin + "&widgetid=1&color=purple&theme=dark' \n\t\t\t\t\tstyle='width:480px;height:270px; border-radius: 7px;'\n\t\t\t\t\tframeborder='0'\n\t\t\t\t\allow='autoplay; encrypted-media'\n\t\t\t\t\tallowfullscreen='allowfullscreen'\n\t\t\t\t\tmozallowfullscreen='mozallowfullscreen'\n\t\t\t\t\tmsallowfullscreen='msallowfullscreen'\n\t\t\t\t\toallowfullscreen='oallowfullscreen'\n\t\t\t\t\twebkitallowfullscreen='webkitallowfullscreen'\n\t\t\t\t\t></iframe>\n\t\t\t\t"), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "soundcloud",
                    value: function (aud) {
                        if (!this.mute) {
							this.$dialog.addClass('bubble_autowidth');
                            this.$dialogCont.html("<iframe height='166' scrolling='no' frameborder='no' allow='autoplay' style='font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100; border-radius: 7px;' src='https://w.soundcloud.com/player/?url=" + aud.replace(/(^\w+:|^)\/\//, '//') + "&color=%2374119c&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true'></iframe><div style='font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100; border-radius: 7px;'></div>"), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "spotify",
                    value: function (aud) {
                        if (!this.mute) {
							this.$dialog.addClass('bubble_autowidth');
                            this.$dialogCont.html("<iframe style='border-radius:12px;width:415px;' src='https://open.spotify.com/embed/" + aud.replace(/(^\w+:|^)\/.*\.spotify\.com\//, '') + "?utm_source=generator&theme=0' width='60%' height='152' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe>"), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "image",
                    value: function (img) {
                        if (!this.mute) {
                            var b = "embed";
                            this.$dialogCont.html("<img id='bw_image' width='170' max-height='460' src='" + img + "'></img>"), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "video",
                    value: function (vid) {
                        if (!this.mute) {
                            var b = "embed";
                            this.$dialog.addClass('bubble_autowidth');
                            this.$dialogCont.html("<video id='bw_video' style='border-radius: 7px;' controls height='270' autoplay loop><source src='" + vid + "' type='video/mp4'></video>"), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "audio",
                    value: function (aud) {
						if (!this.mute) {
							var b = "embed";
							this.$dialog.addClass('bubble_autowidth');
							this.$dialogCont.html("<audio id='bw_audio' controls autoplay loop><source src='" + aud + "' type='audio/mp3'></source></audio>"), this.$dialog.show();
						}
                    },
                },
                {
                    key: "backflip",
                    value: function(swag) {
                        var b = [{
                            type: "anim",
                            anim: "backflip",
                            ticks: 15
                        }];
                        swag && (b.push({
                            type: "anim",
                            anim: "cool_fwd",
                            ticks: 20
                        }), b.push({
                            type: "idle"
                        })), this.runSingleEvent(b);
                    },
                },
                {
                    key: "clap",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "clap_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "clap_clippy",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "clap_clippy_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "sad",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "sad_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "think",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "think_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "wave",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "wave",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "nod",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "nod",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "clap_clippy",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "clap_clippy_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "banana",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "banana_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "surprised",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "surprised_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "laugh",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "laugh_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "shrug",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "shrug_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "greet",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "greet_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "write",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "write_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "write2",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "write_once_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "write3",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "write_infinite_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "surf",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "surf_across_fwd",
                            ticks: 15
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "swag",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "cool_fwd",
                            ticks: 40
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "confused",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "confused_fwd",
                            ticks: 40
                        }];
                        this.runSingleEvent(emote);
                        var a = new Audio("/sfx/confused.mp3");
                        a.play();
                    },
                },
                {
                    key: "bang",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "beat_fwd",
                            ticks: 15
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "earth",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "earth_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "grin",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "grin_fwd",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "surfjoin",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "surf_intro_emote",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "surfleave",
                    value: function() {
                        var emote = [{
                            type: "anim",
                            anim: "surf_away_emote",
                            ticks: 30
                        }];
                        this.runSingleEvent(emote);
                    },
                },
                {
                    key: "updateDialog",
                    value: function () {
                        var max = this.maxCoords();
                        this.data.size.x + this.$dialog.width() > max.x
                            ? this.y < this.$container.height() / 2 - this.data.size.x / 2
                                ? this.$dialog.removeClass("bubble-top").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-bottom")
                                : this.$dialog.removeClass("bubble-bottom").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-top")
                            : this.x < this.$container.width() / 2 - this.data.size.x / 2
                            ? this.$dialog.removeClass("bubble-left").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-right")
                            : this.$dialog.removeClass("bubble-right").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-left");
                    },
                },
                {
                    key: "maxCoords",
                    value: function () {
                        return { x: this.$container.width() - this.data.size.x, y: this.$container.height() - this.data.size.y - $("#chat_bar").height() };
                    },
                },
                {
                    key: "asshole",
                    value: function (target) {
                        this.runSingleEvent([
                            { type: "text", text: "Hey, " + target + "!" },
                            { type: "text", text: "You're a fucking asshole!", say: "your a fucking asshole!" },
                            { type: "anim", anim: "grin_fwd", ticks: 15 },
                            { type: "idle" },
                        ]);
                    },
                },
                {
                    key: "welcome",	
                    value: function (target) {
                        this.runSingleEvent([
                            { type: "anim", anim: "greet_fwd", ticks: 15 },
                            { type: "text", text: "Hello, " + target + "!" },
                            { type: "idle" },
                        ]);
                    },
                },
                {
					key: "owo",
                    value: function (target, data) {
                        this.runSingleEvent([
                            { type: "text", text: "*notices " + target + "'s BonziBulge™*", say: "notices " + target + "s bonzibulge" },
                            { type: "text", text: "♥ ( 。 O ω O 。 )<br/>owo, wat dis?", say: "oh woah, what diss?" },
                        ]);
                    },
                },
                {
					key: "uwu",
                    value: function (target, data) {
                        this.runSingleEvent([
                            { type: "text", text: "*notices " + target + "'s BonziBulge™*", say: "notices " + target + "s bonzibulge" },
                            { type: "text", text: "♥ ( 。 U ω U 。 )<br/>uwu, wat dis? uwu", say: "uwu, what diss?" },
                        ]);
                    },
                },
                {
                    key: "updateSprite",
                    value: function (hide) {
                        var stage = BonziHandler.stage;
                            stage.removeChild(this.sprite);
                            var info = BonziData.sprite,
                                imgSrc = "./img/agents/empty.webp";
                            this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(new createjs.SpriteSheet({ images: ["./img/agents/empty.webp"], frames: info.frames, animations: Object.assign({}, info.animations, (BonziData.colorAnimations || {})[this.color] || {}) }), hide ? "gone" : "idle")), (this.sprite.id = this.id));
                            stage.addChild(this.sprite);
                            this.move();
                    },
                },
				{
					key: "typing",
					value: function (a) {
						this.$element[0].querySelector(".typing").hidden = !a;
					}
				}
            ]),
            Bonzi
        );
    })(),
    BonziData = {
        size: { x: 200, y: 160 },
        sprite: {
            frames: {
                width: 200,
                height: 160
            },
            animations: {
                idle: 0,
                surf_across_fwd: [1, 8, "surf_across_still", 1],
                wave: [250, 261, "idle", 1],
                sad_fwd: [237, 241, "sad_still", 1],
                sad_still: 241,
                think_fwd: [242, 247, "think_still", 1],
                think_still: 247,
                confused_still: 137,
                surf_across_still: 9,
                surf_across_back: {
                    frames: range(8, 1),
                    next: "idle",
                    speed: 1
                },
                sad_back: {
                    frames: range(239, 237),
                    next: "idle",
                    speed: 1
                },
                confused_fwd: [127, 137, "confused_still", 0.7],
                think_back: {
                    frames: range(247, 242),
                    next: "idle",
                    speed: 1
                },
                confused_back: {
                    frames: range(137, 127),
                    next: "idle",
                    speed: 1
                },
                clap_fwd: {
                    frames: range(10, 14),
                    next: "clap_still",
                    speed: 1
                },
                clap_clippy_fwd: [10, 12, "clap_clippy_still", 1],
                clap_still: [13, 15, "clap_still", 1],
                clap_clippy_still: [13, 13, "clap_clippy_still", 1],
                clap_back: {
                    frames: range(15, 10),
                    next: "idle",
                    speed: 1
                },
                surf_intro: [277, 302, "idle", 1],
                surf_intro_emote: [277, 302, "wave", 1],
                surf_away: [16, 38, "gone", 1],
                surf_away_emote: [16, 38, "gone_emote", 1],
                gone_emote: [38, 39, "surf_intro_emote"],
                gone: 39,
                shrug_fwd: [45, 50, "shrug_still", 1],
                nod: [40, 44, "idle", 1],
                shrug_still: 50,
                shrug_back: {
                    frames: range(50, 45),
                    next: "idle",
                    speed: 1
                },
                earth_fwd: [51, 57, "earth_still", 1],
                earth_still: [58, 80, "earth_still", 1],
                earth_back: [81, 86, "idle", 1],
                look_down_fwd: [87, 90, "look_down_still", 1],
                look_down_still: 91,
                look_down_back: {
                    frames: range(90, 87),
                    next: "idle",
                    speed: 1
                },
                lean_left_fwd: [94, 97, "lean_left_still", 1],
                lean_left_still: 98,
                lean_left_back: {
                    frames: range(97, 94),
                    next: "idle",
                    speed: 1
                },
                beat_fwd: [101, 103, "beat_still", 1],
                banana_fwd: [344, 354, "idle", 0.6],
                surprised_fwd: [356, 360, "surprised_still", 0.8],
                laugh_fwd: [361, 364, "laugh_still", 0.8],
                write_fwd: [365, 377, "write_still", 0.8],
                write_once_fwd: [365, 400, "write_once_still", 0.8],
                write_infinite_fwd: [365, 396, "write_infinite", 0.8],
                write_infinite: [381, 396, "write_infinite", 0.8],
                write_still: 377,
                write_once_still: 401,
                write_back: {
                    frames: range(378, 366),
                    next: "idle",
                    speed: 0.8
                },
                laugh_back: {
                    frames: range(364, 361),
                    next: "idle",
                    speed: 0.8
                },
                surprised_back: {
                    frames: range(360, 356),
                    next: "idle",
                    speed: 0.8
                },
                laugh_still: [363, 364, "laugh_still", 0.6],
                surprised_still: 360,
                banana_fwd: [344, 354, "banana_back", 0.6],
                banana_back: [350, 344, "idle", 0.6],
                beat_still: [104, 107, "beat_still", 1],
                beat_back: {
                    frames: range(103, 101),
                    next: "idle",
                    speed: 1
                },
                cool_fwd: [108, 126, "cool_still", 1],
                cool_still: 126,
                cool_back: {
                    frames: range(126, 108),
                    next: "idle",
                    speed: 1
                },
                cool_right_fwd: [126, 128, "cool_right_still", 1],
                cool_right_still: 129,
                cool_right_back: {
                    frames: range(128, 126),
                    next: "idle",
                    speed: 1
                },
                cool_left_fwd: [131, 133, "cool_left_still", 1],
                cool_left_still: 134,
                cool_left_back: {
                    frames: range(133, 131),
                    next: "cool_still",
                    speed: 1
                },
                cool_adjust: {
                    frames: [124, 123, 122, 121, 120, 135, 136, 135, 120, 121, 122, 123, 124],
                    next: "cool_still",
                    speed: 1
                },
                present_fwd: [137, 141, "present_still", 1],
                present_still: 142,
                present_back: {
                    frames: range(141, 137),
                    next: "idle",
                    speed: 1
                },
                look_left_fwd: [143, 145, "look_left_still", 1],
                look_left_still: 146,
                look_left_back: {
                    frames: range(145, 143),
                    next: "idle",
                    speed: 1
                },
                look_right_fwd: [149, 151, "look_right_still", 1],
                look_right_still: 152,
                look_right_back: {
                    frames: range(151, 149),
                    next: "idle",
                    speed: 1
                },
                lean_right_fwd: {
                    frames: range(158, 156),
                    next: "lean_right_still",
                    speed: 1
                },
                lean_right_still: 155,
                lean_right_back: [156, 158, "idle", 1],
                praise_fwd: [159, 163, "praise_still", 1],
                praise_still: 164,
                praise_back: {
                    frames: range(163, 159),
                    next: "idle",
                    speed: 1
                },
                greet_fwd: [225, 232, "greet_still", 1],
                greet_still: 232,
                greet_back: {
                    frames: range(232, 225),
                    next: "idle",
                    speed: 1
                },
                grin_fwd: [182, 189, "grin_still", 1],
                grin_still: 184,
                grin_back: {
                    frames: range(184, 182),
                    next: "idle",
                    speed: 1
                },
                backflip: [331, 343, "idle", 1],
                lipsync0: 319,
                lipsync1: 320,
                lipsync2: 321,
                lipsync3: 322,
                shrug_lipsync0: 47,
                shrug_lipsync1: 48,
                shrug_lipsync2: 49,
                shrug_lipsync3: 50,
                greet_lipsync0: 328,
                greet_lipsync1: 329,
                greet_lipsync2: 330,
                greet_lipsync3: 330,
                think_lipsync0: 319,
                think_lipsync1: 320,
                think_lipsync2: 321,
                think_lipsync3: 322,
                sad_lipsync0: 319,
                sad_lipsync1: 320,
                sad_lipsync2: 321,
                sad_lipsync3: 322,
                confused_lipsync0: 319,
                confused_lipsync1: 320,
                confused_lipsync2: 321,
                confused_lipsync3: 322,
            },
        },
        colorAnimations: {
            ghost: {
                lipsync0: 345,
                lipsync1: 346,
                lipsync2: 347,
                lipsync3: 348,
                shrug_lipsync0: 351,
                shrug_lipsync1: 352,
                shrug_lipsync2: 353,
                shrug_lipsync3: 354,
                greet_lipsync0: 328,
                greet_lipsync1: 329,
                greet_lipsync2: 330,
                greet_lipsync3: 330,
                think_lipsync0: 345,
                think_lipsync1: 346,
                think_lipsync2: 347,
                think_lipsync3: 348,
                sad_lipsync0: 345,
                sad_lipsync1: 346,
                sad_lipsync2: 347,
                sad_lipsync3: 348,
                confused_lipsync0: 345,
                confused_lipsync1: 346,
                confused_lipsync2: 347,
                confused_lipsync3: 348,
            },
        },
        to_idle: {
            surf_across_fwd: "surf_across_back",
            sad_still: "sad_back",
            think_still: "think_back",
            think_fwd: "think_back",
            surf_across_still: "surf_across_back",
            clap_fwd: "clap_back",
            confused_still: "confused_back",
            confused_fwd: "confused_back",
            clap_still: "clap_back",
            surf_away_emote: "gone_emote",
            gone_emote: "surf_intro_emote",
            surf_intro_emote: "wave",
            clap_clippy_still: "clap_back",
            clap_clippy_fwd: "clap_back",
            shrug_fwd: "shrug_back",
            greet_fwd: "greet_back",
            shrug_still: "shrug_back",
            greet_still: "greet_back",
            earth_fwd: "earth_back",
            earth_still: "earth_back",
            look_down_fwd: "look_down_back",
            look_down_still: "look_down_back",
            lean_left_fwd: "lean_left_back",
            lean_left_still: "lean_left_back",
            beat_fwd: "beat_back",
            banana_fwd: "banana_back",
            surprised_fwd: "surprised_back",
            surprised_still: "surprised_back",
            laugh_fwd: "laugh_back",
            write_fwd: "write_back",
            write_once_fwd: "write_back",
            write_infinite_fwd: "write_back",
            write_infinite: "write_back",
            write_still: "write_back",
            write_once_still: "write_back",
            laugh_still: "laugh_back",
            beat_still: "beat_back",
            cool_fwd: "cool_back",
            cool_still: "cool_back",
            cool_adjust: "cool_back",
            cool_left_fwd: "cool_left_back",
            cool_left_still: "cool_left_back",
            present_fwd: "present_back",
            present_still: "present_back",
            look_left_fwd: "look_left_back",
            look_left_still: "look_left_back",
            look_right_fwd: "look_right_back",
            look_right_still: "look_right_back",
            lean_right_fwd: "lean_right_back",
            lean_right_still: "lean_right_back",
            praise_fwd: "praise_back",
            praise_still: "praise_back",
            grin_fwd: "grin_back",
            grin_still: "grin_back",
            backflip: "idle",
            idle: "idle",
        },
        pass_idle: ["gone"],
		
        event_list_behh_open: [
            [{
                type: "text",
                text: "Prepare your behh, and lets behh, you behh."
            }, ],
            [{
                    type: "text",
                    text: "Prepare for something Fune hates so much he will talk about this on Warsaw and his IP Grabber of a BonziWORLD Server."
                },
                {
                    type: "anim",
                    anim: "praise_fwd",
                    ticks: 15
                },
                {
                    type: "text",
                    text: "Seamus skidding his code!"
                },
                {
                    type: "anim",
                    anim: "praise_back",
                    ticks: 15
                },
            ],
            [{
                type: "text",
                text: "{NAME} used /behh. Time to fucking behh myself."
            }],
            [{
                type: "text",
                text: "{NAME} asked me for behh spam."
            }],
            [{
                type: "text",
                text: "Prepare to be behhed."
            }],
            [{
                type: "text",
                text: "HEY YOU IDIOTS ITS TIME FOR A BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH BEHH"
            }],
            [{
                    type: "text",
                    text: "Wanna hear me spam behh?"
                },
                {
                    type: "text",
                    text: "No?"
                },
                {
                    type: "text",
                    text: "That's ok. I didn't really want to do this anyway"
                },
            ],
            [{
                type: "text",
                text: "Hey, paul!"
            }, ],
            [{
                type: "text",
                text: "Time to make behh videos."
            }, ],
            [{
                type: "text",
                text: "Behh yourself like a egg, behh."
            }, ],
            [{
                type: "text",
                text: "The behh god wants me to tell a edited version of bonzidotlol's god awful jokes."
            }],
            [{
                type: "text",
                text: "Time for behh."
            }],
        ],
        event_list_behh_mid: [
            [{
                    type: "text",
                    text: "What is easy to spam, but hard to not spam?"
                },
                {
                    type: "text",
                    text: "behh"
                },
            ],
            [{
                    type: "text",
                    text: "Why do they call bonzidotlol mid?"
                },
                {
                    type: "text",
                    text: "Because it is."
                },
                {
                    type: "anim",
                    anim: "shrug_back",
                    ticks: 15
                },
                {
                    type: "text",
                    text: "Sorry. I just had a brain wave."
                },
            ],
            [{
                    type: "text",
                    text: "Behn!",
                },
                {
                    type: "anim",
                    anim: "shrug_back",
                    ticks: 15
                },
                {
                    type: "text",
                    text: "What were you behhing? A behh? you're a behh and you know it"
                },
            ],
            [{
                    type: "text",
                    text: "What is in the middle of bonziworld.co?"
                },
                {
                    type: "text",
                    text: "A behh."
                },
            ],
            [{
                    type: "text",
                    text: "Why can't i behh?"
                },
                {
                    type: "text",
                    text: "Because Behh. That's the whole joke."
                },
            ],
            [{
                type: "text",
                text: "The behh."
            }, ],
            [{
                    type: "text",
                    text: "What goes in behh	?"
                },
                {
                    type: "text",
                    text: "Behh."
                },
            ],
            [{
                    type: "text",
                    text: "What type of behh won't freeze?"
                },
                {
                    type: "text",
                    text: "Behh."
                },
            ],
            [{
                    type: "text",
                    text: "Who earns a living by driving his behhs away?"
                },
                {
                    type: "text",
                    text: "Hunge hugo."
                },
            ],
            [{
                    type: "text",
                    text: "What did the behn say to the behh?"
                },
                {
                    type: "text",
                    text: "Behh my behn."
                },
            ],
            [{
                    type: "text",
                    text: "What do you call a egg who shaves 10 times a day?"
                },
                {
                    type: "text",
                    text: "A behh."
                },
            ],
            [{
                    type: "text",
                    text: "How do you get behh in eggs?"
                },
                {
                    type: "text",
                    text: "behh."
                },
            ],
            [{
                    type: "text",
                    text: "Why do we call behh behh?"
                },
                {
                    type: "text",
                    text: "Because we BEHH it."
                },
            ],
            [{
                    type: "text",
                    text: "How many behh does it take to knock down a behh?"
                },
                {
                    type: "text",
                    text: "I don't know but just a few can behh."
                },
            ],
            [{
                    type: "text",
                    text: "What do you call an behh?"
                },
                {
                    type: "text",
                    text: "Behh"
                },
            ],
            [{
                    type: "text",
                    text: "Here's a behh:"
                },
                {
                    type: "text",
                    text: "behh behh behh behh behh behh behh behh behh behh "
                },
            ],
            [{
                    type: "text",
                    text: "Why did Seamus' brother behh?"
                },
                {
                    type: "text",
                    text: "Behh."
                },
            ],
            [{
                    type: "text",
                    text: "Who am I?"
                },
                {
                    type: "text",
                    text: "A behh."
                },
            ],
            [{
                    type: "text",
                    text: "Why did the behh?"
                },
                {
                    type: "text",
                    text: "Because fuck you."
                },
            ],
            [{
                    type: "text",
                    text: "What is a behh that eats behh?"
                },
                {
                    type: "text",
                    text: "behh"
                },
                {
                    type: "text",
                    text: "I'm a behh, I know."
                },
            ],
            [{
                    type: "text",
                    text: "How do you get a behh?"
                },
                {
                    type: "text",
                    text: "You behh."
                },
                {
                    type: "text",
                    text: "I'm a behh, I know."
                },
            ],
        ],
        event_list_behh_end: [
            [{
                    type: "text",
                    text: "You know {NAME}, a good behh behhs."
                },
                {
                    type: "text",
                    text: "And you behhing behh. Thanks."
                },
            ],
            [{
                type: "text",
                text: "Where do I come up with behh? My behh?"
            }],
            [{
                    type: "text",
                    text: "Do I behh you, {NAME}? Am I behh? Do I make you behh?"
                },
                {
                    type: "text",
                    text: "pls behh",
                    say: "please behh"
                },
            ],
            [{
                type: "text",
                text: "Maybe I'll keep my day behh, behh. behh didn't accept behh."
            }],
            [{
                    type: "text",
                    text: "behh is the best behh!"
                },
                {
                    type: "text",
                    text: "Apart from behh."
                },
            ],
            [{
                type: "text",
                text: "Now behh."
            }, ],
            [{
                type: "text",
                text: "Look how much fun behhing can be!"
            }, ],
            [{
                type: "text",
                text: "God i love behh so much."
            }, ],
            [{
                    type: "text",
                    text: "Don't judge me on my sense of behh alone."
                },
                {
                    type: "text",
                    text: "Help! I'm behh!"
                },
            ],
        ],

        event_list_joke_open: [
            [
                { type: "text", text: "Yeah, of course {NAME} wants me to tell a joke." },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: '"Haha, look at the stupid {COLOR} monkey telling jokes!" Fuck you. It isn\'t funny.', say: "Hah hah! Look at the stupid {COLOR} monkey telling jokes! Fuck you. It isn't funny." },
                { type: "anim", anim: "praise_back", ticks: 15 },
                { type: "text", text: "But I'll do it anyway. Because you want me to. I hope you're happy." },
            ],
			[
                { type: "text", text: "Look at me praising!" },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: "Praise God!" },
                { type: "anim", anim: "praise_back", ticks: 15 },
            ],
			[
                { type: "text", text: "Prepare for something everyone never heard of, {NAME}" },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: "HUMOUR" },
                { type: "anim", anim: "praise_back", ticks: 15 },
            ],
            [{ type: "text", text: "{NAME} used /joke. Whoop-dee-fucking doo." }],
            [{ type: "text", text: "HEY YOU IDIOTS ITS TIME FOR A JOKE" }],
            [
                { type: "text", text: "Wanna hear a joke?" },
                { type: "text", text: "No?" },
                { type: "text", text: "Mute me then. That's your fucking problem." },
            ],
			[
                { type: "text", text: "Keep yourself safe, {NAME}" },
                { type: "text", text: "I'm here to entertain you." },
            ],
			[{
                type: "text",
                text: "HEY YOU IDIOTS ITS TIME FOR A JOKE"
            }],
			[{
                type: "text",
                text: "Mr. {NAME} wants me to tell a joke."
            }],
			[
			{"type": 0, "text": "I'm not here to entertain you, {NAME}"},
			{"type": 0, "text": "Sorry."}
		],
			[
                { type: "text", text: "Wanna hear a joke for the 3rd time?" },
                { type: "text", text: "No?" },
                { type: "text", text: "That's your problem Then I'm Leaving." },
            ],
            [
                { type: "text", text: "Hey guys! Want to hear a joke?" },
                { type: "text", text: "Yes!" },
                { type: "text", text: "Okay." },
            ],
			[{ type: "text", text: "OK, you'll have to laugh at this one." }],
            [{ type: "text", text: "Ready for some classic comedy?" }],
            [{ type: "text", text: "Senpai {NAME} wants me to tell a joke." }],
            [{ type: "text", text: "Time for whatever horrible fucking jokes the creator of this site wrote." }],
			[{ type: "text", text: "Joke time!" }],
			[{ type: "text", text: "Prepare." }],
			[{ type: "text", text: "Prepare to laugh." }],
			[{ type: "text", text: "Did you type /joke? {NAME} did." }],
			[{ type: "text", text: "I'm not a joke machine, {NAME}." }],
			[ { type: "text", text: "Comedic subroutines engaged. Prepare to breathe air slightly faster through your nose." } ],
            [ { type: "text", text: "The {COLOR} show is about to begin! Hold onto your pixels." } ],
            [ { type: "text", text: "Error 404: Humor not found. Just kidding, I've got plenty of 'em." } ],
        ],
        event_list_joke_mid: [
            [
                { type: "text", text: "What is easy to get into, but hard to get out of?" },
                { type: "text", text: "Child support!" },
            ],
            [
                { type: "text", text: "Why do they call HTML HyperText?" },
                { type: "text", text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "Sorry. I just had an epiphany of my own sad, sad existence." },
            ],
            [
                {
                    type: "text",
                    text: 'Two sausages are in a pan. One looks at the other and says "Boy it\'s hot in here!" and the other sausage says "Unbelievable! It\'s a talking sausage!"',
                    say: "Two sausages are in a pan. One looks at the other and says, Boy it's hot in here! and the other sausage says, Unbelievable! It's a talking sausage!",
                },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "What were you expecting? A dick joke? You're a sick fuck." },
            ],
			 [{
                type: "text",
                text: "Why did the chicken cross the road?"
            }, {
                 type: "anim",
                 anim: "shrug_back",
                 ticks: 15
             },
             {
                type: "text",
                text: "Ok, let's get serious. I'll let you in on a little secret the feds don't want you knowing."
            }, {
                type: "text",
                text: "Phones have a secret Instant Charging feature, you can enable it by microwaving your phone."
            }, {
                type: "text",
                text: "Or charge it. Don't microwave your phone or it will explode!"
            },
			 ],
                [
                  { type: "text", text: "Why did the programmer quit his job?" },
                  { type: "text", text: "Because he didn't get arrays." },
                ],
                [
                  { type: "text", text: "What do you call a belt made of watches?" },
                  { type: "text", text: "A waist of time." },
                ],
                [
                  { type: "text", text: "I'm reading a book on anti-gravity." },
                  { type: "text", text: "It's impossible to put down!" },
                ],
                [
                  { type: "text", text: "Parallel lines have so much in common." },
                  { type: "text", text: "It's a shame they'll never meet." },
                ],
                [
                  { type: "text", text: "What's the difference between a snowman and a snowwoman?" },
                  { type: "text", text: "Snowballs." },
                ],
                [
                  { type: "text", text: "I'm on a whiskey diet." },
                  { type: "text", text: "I've lost three days already." },
                ],
            [
                { type: "text", text: "What is in the middle of Paris?" },
                { type: "text", text: "A giant inflatable buttplug." },
            ],
			[
                { type: "text", text: "I can't do the joke." }
            ],
			[
                { type: "text", text: "Great, i wasted your time!" }
            ],
            [
                { type: "text", text: "What goes in pink and comes out blue?" },
                { type: "text", text: "Sonic's WOAH WOAH WOAH WHAT!" },
            ],
            [
                { type: "text", text: "What type of water won't freeze?" },
                { type: "text", text: "Your mother's." },
            ],
            [
                { type: "text", text: "Who earns a living by driving his customers away?" },
                { type: "text", text: "Nintendo!" },
            ],
            [
                { type: "text", text: "What did the digital clock say to the grandfather clock?" },
                { type: "text", text: "Suck my clock." },
            ],
            [
                { type: "text", text: "What do you call a man who shaves 10 times a day?" },
                { type: "text", text: "A woman." },
            ],
            [
                { type: "text", text: "How do you get water in watermelons?" },
                { type: "text", text: "Cum in them." },
            ],
            [
                { type: "text", text: "Why do we call money bread?" },
                { type: "text", text: "Because we KNEAD it. Haha please send money to my PayPal at nigerianprince99@bonzi.com" },
            ],
            [
                { type: "text", text: "What is a cow that eats grass?" },
                { type: "text", text: "ASS" },
                { type: "text", text: "I'm a comedic genius, I know." },
            ],
        ],
        event_list_joke_end: [
            [
                { type: "text", text: "You know {NAME}, a good friend laughs at your jokes even when they're not so funny." },
                { type: "text", text: "And you fucking suck. Thanks." },
            ],
            [{ type: "text", text: "Where do I come up with these? My ass?" }],
            [
                { type: "text", text: "Do I amuse you, {NAME}? Am I funny? Do I make you laugh?" },
                { type: "text", text: "pls respond", say: "please respond" },
            ],
            [{ type: "text", text: "Maybe I'll keep my day job, {NAME}. Patreon didn't accept me." }],
			[{ type: "text", text: "NOW LAUGH!" }],
			[{ type: "text", text: "I hope you're offended." }],
			[{ type: "text", text: "I hope you laughed at that joke, {NAME}." }],
			[{ type: "text", text: "I hope you laughed." }],
			[{ type: "text", text: "Laugh. just laugh." }],
			[{ type: "text", text: "Now you can laugh." }],
			[{ type: "text", text: "Haha! so funny!" }],
			[{ type: "text", text: "Now can you laugh at my jokes?" }],
			[{ type: "text", text: "Now, Thats all for the joke! now laugh!" }],
			[{ type: "text", text: "That's All Folks!" }],
			[{ type: "text", text: "The Joke's Done! Now you can laugh." }],
            [
                { type: "text", text: "Laughter is the best medicine!" },
                { type: "text", text: "Apart from meth." },
            ],
            [
                { type: "text", text: "Don't judge me on my sense of humor alone." },
                { type: "text", text: "Help! I'm being oppressed!" },
            ],
        ],
        event_list_fact_open: [ 
			[{ type: "html", text: "Hey kids, it's time for a Fun Fact&reg;!", say: "Hey kids, it's time for a Fun Fact!" }],
			[{ type: "text", text: "Did you type /fact? {NAME} did." }],
            [ { type: "text", text: "Fact check! {NAME} is currently used /fact." } ],
            [ { type: "text", text: "Welcome to the Fact of Bonzi. Fun fact is power!" } ],
            [ { type: "text", text: "Prepare your earballs, I'm about to drop some fact." } ]

		],
        event_list_fact_mid: [
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Did you know that Uranus is 31,518 miles (50,724 km) in diameter?", say: "Did you know that Yer Anus is 31 thousand 500 and 18 miles in diameter?" },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "text", text: "Fun Fact: The skript kiddie of this site didn't bother checking if the text that goes into the dialog box is HTML code." },
                { type: "html", text: "<img class=no_selection src=img/icons/bonzi/topjej.png draggable=false></img>", say: "toppest jej" },
            ],
        ],
        event_list_fact_end: [
			[
				{ type: "text", text: "o gee whilickers wasn't that sure interesting huh" }
			],
			[{
                type: "text",
               text: "The more you know, the more you realize you don't know anything." 
             }],
            [{
                type: "text",
               text: "Stay curious, or don't. I'm a {NAME}, not a thing." 
             }],
            [{
                type: "text",
               text: "And that's why they pay me the big bucks. Oh wait, I don't get paid." 
             }],
                        [{ type: "text", text: "geez this fact was interesting right? {NAME}?" }],
			[
                { type: "text", text: "What an amazing fact!" }
			]
		],
        event_list_behhfact_open: [[{ type: "html", text: "Hey kids, it's time for a BEHH!", say: "Hey kids, it's time for a BEHH" }]],
        event_list_behhfact_mid: [
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Did you know that behn?" },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Behh are behhs." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Behh month is real. The month is the current month on the Georgian Calendar." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Bonzidotlol is mid." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Fuckune did everything that's bad." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Seamus lives in behh land." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "text", text: "Fun Fact: behh" },
                { type: "html", text: "<img src='./img/misc/topjej.png'></img>", say: "behh" },
            ],
        ],
        event_list_behhfact_end: [[{ type: "text", text: "o bee behh wasn't that sure behhing heh" }]],
    };
function range(begin, end) {
    for (var array = [], i = begin; i <= end; i++) array.push(i);
    for (i = begin; i >= end; i--) array.push(i);
    return array;
}
function replaceAll(t, s, r) {
    return t.replace(new RegExp(s, "g"), r);
}
function s4() {
    return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
}
function youtubeParser(url) {
	// added support for yt shorts
    // added support for playlists
    var match = url.match(/^.*((youtube|youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(playlist\?list=)|(watch\?v=))([^#\&\?]*).*/);
    return !(!match || 11 != match[9].length) && match[9] || !(!match || 34 != match[9].length) && "playlist?list="+match[9];
}
/*function soundcloudParser(url) {
    var match = url.match(/^.*(soundcloud\.com|snd\.sc)\/(.*)/);
    return !(!match || 11 != match[3].length) && match[3];
}
function spotifyParser(url) {
    var match = url.match(/^(.*\.spotify\.com)\/(track|album|playlist)\/(.*)/);
    return !(!match || 11 != match[4].length) && match[4];
}*/
function rtimeOut(callback, delay) {
    var stop,
        dateNow = Date.now,
        requestAnimation = window.requestAnimationFrame,
        start = dateNow(),
        timeoutFunc = function () {
            dateNow() - start < delay ? stop || requestAnimation(timeoutFunc) : callback();
        };
    return (
        requestAnimation(timeoutFunc),
        {
            clear: function () {
                stop = 1;
            },
        }
    );
}
function rInterval(callback, delay) {
    var stop,
        dateNow = Date.now,
        requestAnimation = window.requestAnimationFrame,
        start = dateNow(),
        intervalFunc = function () {
            dateNow() - start < delay || ((start += delay), callback()), stop || requestAnimation(intervalFunc);
        };
    return (
        requestAnimation(intervalFunc),
        {
            clear: function () {
                stop = 1;
            },
        }
    );
}
function linkify(text) {
    return text/*.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/gi, "<a href='$1' target='_blank'>$1</a>")*/;
}

(BonziData.event_list_behh = [{
        type: "add_random",
        pool: "event_list_behh_open",
        add: BonziData.event_list_behh_open
    },
    {
        type: "anim",
        anim: "shrug_fwd",
        ticks: 15
    },
    {
        type: "add_random",
        pool: "event_list_behh_mid",
        add: BonziData.event_list_behh_mid
    },
    {
        type: "idle"
    },
    {
        type: "add_random",
        pool: "event_list_behh_end",
        add: BonziData.event_list_behh_end
    },
    {
        type: "idle"
    },
]),
(BonziData.event_list_joke = [
    { type: "add_random", pool: "event_list_joke_open", add: BonziData.event_list_joke_open },
    { type: "anim", anim: "shrug_fwd", ticks: 15 },
    { type: "add_random", pool: "event_list_joke_mid", add: BonziData.event_list_joke_mid },
    { type: "idle" },
    { type: "add_random", pool: "event_list_joke_end", add: BonziData.event_list_joke_end },
    { type: "idle" },
]),
    (BonziData.event_list_fact = [
        { type: "add_random", pool: "event_list_fact_open", add: BonziData.event_list_fact_open },
        { type: "add_random", pool: "event_list_fact_mid", add: BonziData.event_list_fact_mid },
        { type: "idle" },
        { type: "add_random", pool: "event_list_fact_end", add: BonziData.event_list_fact_end },
        { type: "idle" },
    ]),
    (BonziData.event_list_behhfact = [
        { type: "add_random", pool: "event_list_fact_open", add: BonziData.event_list_behhfact_open },
        { type: "add_random", pool: "event_list_fact_mid", add: BonziData.event_list_behhfact_mid },
        { type: "idle" },
        { type: "add_random", pool: "event_list_fact_end", add: BonziData.event_list_behhfact_end },
        { type: "idle" },
    ]),
    (BonziData.event_list_linux = [
        { type: "text", text: "I'd just like to interject for a moment. What you’re referring to as Linux, is in fact, BONZI/Linux, or as I’ve recently taken to calling it, BONZI plus Linux." },
        {
            type: "text",
            text:
                "Linux is not an operating system unto itself, but rather another free component of a fully functioning BONZI system made useful by the BONZI corelibs, shell utilities and vital system components comprising a full OS as defined by M.A.L.W.A.R.E.",
        },
        {
            type: "text",
            text:
                "Many computer users run a modified version of the BONZI system every day, without realizing it. Through a peculiar turn of events, the version of BONZI which is widely used today is often called “Linux”, and many of its users are not aware that it is basically the BONZI system, developed by the BONZI Project.",
        },
        {
            type: "text",
            text:
                "There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine’s memes to the other programs that you run. ",
        },
        { type: "text", text: "The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system, such as systemd." },
        {
            type: "text",
            text:
                "Linux is normally used in combination with the BONZI operating system: the whole system is basically BONZI with Linux added, or BONZI/Linux. All the so-called “Linux” distributions are really distributions of BONZI/Linux.",
        },
    ]),
    (BonziData.event_list_pawn = [
        {
            type: "text",
            text:
                "Hi, my name is BonziBUDDY, and this is my website. I meme here with my old harambe, and my son, Clippy. Everything in here has an ad and a fact. One thing I've learned after 17 years - you never know what is gonna give you some malware.",
        },
    ]),
	(function () {
		const event_list_bees = [
			{ type: "text", text: "According to all known laws of physics" },
            { type: "anim", anim: "praise_fwd", ticks: 15 },
			{ type: "text", text: "of aviation," },
			{ type: "text", text: "there is no way a bee" },
			{ type: "text", text: "should be able to fly." },
			{ type: "text", text: "Its wings are too small to get" },
			{ type: "text", text: "its fat little body off the ground." },
			{ type: "text", text: "The bee, of course, flies anyway" },
			{ type: "text", text: "because bees don't care" },
			{ type: "text", text: "what humans think is impossible." },
			{ type: "text", text: "Yellow, black. Yellow, black." },
			{ type: "text", text: "Yellow, black. Yellow, black." },
			{ type: "text", text: "Ooh, black and yellow!" },
			{ type: "text", text: "Nah" },
            { type: "anim", anim: "praise_back", ticks: 15 },
			{ type: "text", text: "I'm not doing the whole fuckin thing." },
			{ type: "text", text: "..." },
			{ type: "text", text: "Screw You!" },
		];
		try {
			BonziData && (BonziData.event_list_bees = event_list_bees);
		} catch (err) {
			console.error(err);
		}
	})(),
    $(document).ready(function () {
        window.BonziHandler = new (function () {
            return (
                (this.framerate = 1 / 15),
                (this.spriteSheets = {}),
				(this.sprites = ["black","grey","white","ghost","blue","cyan","brown","green","lime","purple","red","orange","yellow","pink","pope"]),
                (this.prepSprites = function () {
					for (var spriteColors = this.sprites, i = 0; i < spriteColors.length; i++) {
						var color = spriteColors[i],
                            spriteData = { images: ["./img/agents/" + color + ".png"], frames: BonziData.sprite.frames, animations: BonziData.sprite.animations };
                        this.spriteSheets[color] = new createjs.SpriteSheet(spriteData);
                    }
                }),
                (this.prepSprites()),
                (this.$canvas = $("#bonzi_canvas")),
                (this.stage = new createjs.StageGL(this.$canvas[0], { transparent: !0 })),
                (this.stage.tickOnUpdate = !1),
                (this.resizeCanvas = function () {
                    var width = this.$canvas.width(),
                        height = this.$canvas.height();
                    this.$canvas.attr({ width: this.$canvas.width(), height: this.$canvas.height() }), this.stage.updateViewport(width, height), (this.needsUpdate = !0);
                    for (var i = 0; i < usersAmt; i++) {
                        var key = usersKeys[i];
                        bonzis[key].move();
                    }
                }),
                this.resizeCanvas(),
                (this.resize = function () {
                    setTimeout(this.resizeCanvas.bind(this), 1);
                }),
                (this.needsUpdate = !0),
                (this.intervalHelper = setInterval(
                    function () {
                        this.needsUpdate = !0;
                    }.bind(this),
                    1e3
                )),
                (this.intervalTick = setInterval(
                    function () {
                        for (var i = 0; i < usersAmt; i++) {
                            var key = usersKeys[i];
                            bonzis[key].update();
                        }
                        this.stage.tick();
                    }.bind(this),
                    1e3 * this.framerate
                )),
                (this.intervalMain = setInterval(
                    function () {
                        this.needsUpdate && (this.stage.update(), (this.needsUpdate = !0));
                    }.bind(this),
                    1e3 / 60
                )),
				isMobileApp && (this.intervalFixAuCtx = setInterval(function () {
					BonziHandler.fixAuCtx();
				}, 1e3)),
				(this.speakList = {}),
                $(window).resize(this.resize.bind(this)),
                (this.bonzisCheck = function () {
                    for (var i = 0; i < usersAmt; i++) {
                        var key = usersKeys[i];
                        if (key in bonzis) {
                            var b = bonzis[key];
                            (b.userPublic = usersPublic[key]), b.updateName(), b.updateStatus(b.userPublic.status);
                            var newColor = usersPublic[key].color;
                            b.color != newColor && ((b.color = newColor), b.updateSprite());
                        } else {
                            bonzis[key] = new Bonzi(key, usersPublic[key]);
                            var joinColor = usersPublic[key].color;
                            var agentJoinSounds = {
                                merlin:      "./sfx/agents/merlin_surfintro.mp3",
                                newmerlin:   "./sfx/agents/merlin_surfintro.mp3",
                                genie:       "./sfx/agents/genie_surfintro.mp3",
                                peedy:       "./sfx/agents/peedy_surfintro.mp3",
                                peedy_pope:  "./sfx/agents/peedy_surfintro.mp3",
                                peedypope:   "./sfx/agents/peedy_surfintro.mp3",
                                max:         "./sfx/agents/max_surfintro.mp3",
                                clippy:      "./sfx/agents/clippy_surfintro.mp3",
                                clippypope:  "./sfx/agents/clippy_surfintro.mp3",
                                red_clippy:  "./sfx/agents/clippy_surfintro.mp3",
                                genius:      "./sfx/agents/genius_surfintro.mp3",
                                god:         "./sfx/agents/god_surfintro.mp3",
                                kairu:       "./sfx/agents/kairu_surfintro.mp3",
                                qmark:       "./sfx/agents/qmark_surfintro.mp3",
                                robby:       "./sfx/agents/robby_surfintro.mp3",
                                rover:       "./sfx/agents/robby_surfintro.mp3",
                                newrover:    "./sfx/agents/robby_surfintro.mp3",
                                pm:          "./sfx/agents/pm_login.mp3",
                                pmpope:      "./sfx/agents/pm_login.mp3"
                            };
                            if (agentJoinSounds[joinColor]) {
                                var joinSfx = new Audio(agentJoinSounds[joinColor]);
                                joinSfx.play();
                            }
                        }
                    }
                }),
                $("#btn_tile").click(function () {
                    for (var winWidth = $(window).width(), winHeight = $(window).height(), minY = 0, addY = 80, x = 0, y = 0, i = 0; i < usersAmt; i++) {
                        var key = usersKeys[i];
                        bonzis[key].move(x, y), (x += 200) + 100 > winWidth && ((x = 0), (y += 160) + 160 > winHeight && ((minY += addY), (addY /= 2), (y = minY)));
                    }
                }),
				(this.checkAuCtx = function () {
					for (var e = Object.keys(this.speakList), t = !0, i = 0; i < e.length; i++) if (!(t = t && this.speakList[e[i]].pusher.initialized)) return !1;
					return t;
				}),
				(this.fixAuCtx = function () {
					BonziHandler.checkAuCtx() || setTimeout(this.refreshAuCtx, 1e3);
				}),
				(this.refreshAuCtx = function () {
					if (!BonziHandler.checkAuCtx()) {
						auCtx.close(), (auCtx = new (window.AudioContext || window.webkitAudioContext)());
						for (var e = Object.keys(bonzis), t = 0; t < e.length; t++) {
							var i = bonzis[e[t]];
							"idle" != i.event.cur().type && i.retry();
						}
					}
				}),
                this
            );
        })();
        $(document).click(function () {
            auCtx.resume();
        });
    }),
    Array.prototype.equals,
    (Array.prototype.equals = function (array) {
        if (!array) return !1;
        if (this.length != array.length) return !1;
        for (var i = 0, l = this.length; i < l; i++)
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i])) return !1;
            } else if (this[i] != array[i]) return !1;
        return !0;
    }),
    Object.defineProperty(Array.prototype, "equals", { enumerable: !1 });
var undefined,
    loadQueue = new createjs.LoadQueue(),
    loadDone = ["bonziBlack", "bonziBlue", "bonziBrown", "bonziGreen", "bonziPurple", "bonziRed", "bonziOrange", "bonziYellow", "bonziWhite", "bonziGrey", "bonziGhost", "bonziLime", "bonziMagenta", "bonziCyan", "bonziPink"],
    loadNeeded = ["bonziBlack", "bonziBlue", "bonziBrown", "bonziGreen", "bonziPurple", "bonziRed", "bonziOrange", "bonziYellow", "bonziWhite", "bonziGrey", "bonziGhost", "bonziLime", "bonziMagenta", "bonziCyan", "bonziPink"];
function loadBonzis(callback) {
    loadQueue.loadManifest([
		{ id: "bonziBlack", src: "./img/agents/black.png" },
		{ id: "bonziBlue", src: "./img/agents/blue.png" },
		{ id: "bonziBrown", src: "./img/agents/brown.png" },
		{ id: "bonziGreen", src: "./img/agents/green.png" },
		{ id: "bonziPurple", src: "./img/agents/purple.png" },
		{ id: "bonziRed", src: "./img/agents/red.png" },
		{ id: "bonziOrange", src: "./img/agents/orange.png" },
		{ id: "bonziYellow", src: "./img/agents/yellow.png" },
		{ id: "bonziWhite", src: "./img/agents/white.png" },
		{ id: "bonziGhost", src: "./img/agents/ghost.png" },
		{ id: "bonziGrey", src: "./img/agents/grey.png" },
		{ id: "bonziLime", src: "./img/agents/lime.png" },
		{ id: "bonziMagenta", src: "./img/agents/magenta.png" },
		{ id: "bonziCyan", src: "./img/agents/cyan.png" },
		{ id: "bonziPink", src: "./img/agents/pink.png" },
	]),
        loadQueue.on(
            "fileload",
            function (callback) {
                loadDone.push(callback.item.id);
            },
            this
        ),
        callback && loadQueue.on("complete", callback, this);
}

// disable regular right clicking
document.addEventListener("contextmenu", function (key){
    key.preventDefault();
}, false);
/*
// "disable" devtools.  fuck off bozoworlders!
$(document).keydown(function(key) {
    if (window.location.hostname.includes("localhost") || enable_skid_protect != true || admin != false) return;
    if (window.location.hostname.includes("127.0.0.1") || enable_skid_protect != true || admin != false) return;
    
    if(key.ctrlKey && key.shiftKey && key.which == 67){key.preventDefault()}
    if(key.ctrlKey && key.shiftKey && key.which == 73){key.preventDefault()}
    if(key.ctrlKey && key.shiftKey && key.which == 74){key.preventDefault()}
    if(key.ctrlKey && key.shiftKey && key.which == 75){key.preventDefault()}
    if(key.ctrlKey && key.shiftKey && key.which == 85){key.preventDefault()}
    if(key.which==123){key.preventDefault()}
});
!function() {
	function detectDevTool(allow, data) {
		if (window.location.hostname.includes("localhost") || enable_skid_protect != true || admin != false) return;
        if (window.location.hostname.includes("127.0.0.1") || enable_skid_protect != true || admin != false) return;
		if(isNaN(+allow)) allow = 100;
		var start = +new Date();
        setInterval(function(){
            debugger;
            console.profile();
            console.profileEnd();
            if (console.clear) {console.clear()};
        },100)
        var end = +new Date();
		if(isNaN(start) || isNaN(end) || end - start > allow) {
            console.log(`[BONZI_AS]:  DEVTOOLS detected ${allow}`);
			(window.kicked = !0), (window.kickData = data), $("#page_skiddie").show();
			socket.disconnect()
			$("#page_error").hide();
		}
	}
	if(window.attachEvent) {
		if (document.readyState === "complete" || document.readyState === "interactive") {
			detectDevTool();
			window.attachEvent('onresize', detectDevTool);
			window.attachEvent('onmousemove', detectDevTool);
			window.attachEvent('onfocus', detectDevTool);
			window.attachEvent('onblur', detectDevTool);
		} else {
			setTimeout(argument.callee, 0);
		}
	} else {
		window.addEventListener('load', detectDevTool);
		window.addEventListener('resize', detectDevTool);
		window.addEventListener('mousemove', detectDevTool);
		window.addEventListener('focus', detectDevTool);
		window.addEventListener('blur', detectDevTool);
	}
}();
*/


function bonziAlert(obj){
    if(typeof obj != "object"){
        obj = {msg:obj}
    }
    let b_alert = document.getElementById("b_alert").content.children[0].cloneNode(true),
        title = b_alert.children[0],
        msg = b_alert.children[2],
        button = b_alert.children[4]
    msg[obj.sanitize?"innerHTML":"innerText"] = obj.msg
    if(obj.title){
        title[obj.sanitize?"innerHTML":"innerText"] = obj.title
    }else{
        title.remove()
    }
    button.innerText = obj.button || "Ok"
    button.onclick = function(){
        b_alert.remove()
    }
    document.getElementById("content").appendChild(b_alert)
    button.focus()
}
function bonziBroadcast(obj){
    if(typeof obj != "object"){
        obj = {msg:obj}
    }
    let b_broadcast = document.getElementById("b_broadcast").content.children[0].cloneNode(true),
        title = b_broadcast.children[0],
        msg = b_broadcast.children[2],
        button = b_broadcast.children[4]
        msg["innerHTML" || "innerText"] = obj.msg
        title.innerText = obj.title || "You received a broadcast!";
    button.innerText = obj.button || "Ok"
    button.onclick = function(){
        b_broadcast.remove()
    }
    document.getElementById("content").appendChild(b_broadcast)
    button.focus()
}


var server_io = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
var socket = io(server_io, {
    query: {
		version: "1.00",
        channel: "bonziuniverse-enhanced",
		release: "production-web",
        lang: (window.navigator && window.navigator.language && window.navigator.language.slice(0, 2)) || "en",
        z: window.zedd,
        s: window.esss
    }, transports: ['websocket']
}),
    usersPublic = {},
    bonzis = {},
    debug = !0;
function Load() {
	$("#login_card").hide(),
	$("#login_error").hide(),
	$("#login_load").show(),
	(window.LoadInterval = rInterval(function () {
		try {
			if ((!loadDone.equals(loadNeeded))) throw "Not done loading.";
				login(), LoadInterval.clear();
		} catch (err) {
			console.error(err);
		}
	}, 100));
}
function login() {
	Bonzi_Name = $("#login_name").val() || "Anonymous";
	var login_sfx = new Audio("./sfx/logon.wav");
	var ab_logon_sfx = new Audio("./sfx/ab_logon.wav");
	ab_logon_sfx.play();
    setTimeout(function () {socket.emit("login", { name: $("#login_name").val(), room: $("#login_room").val() }), bzSetup()}, 954);
	if ($("#login_room").val().includes("test")) debug = true;
	if ($("#login_room").val().includes("debug")) debug = true;
    var date = new Date();
    date.setDate(new Date().getDate() + 365);
    if(getCookie("name") == ""){
        if($("#login_name").val() == "") {
            setCookie("name", "Anonymous", 365)
        } else {
            setCookie("name", encodeURIComponent($("#login_name").val()), 365)
        }
    } else {
        if($("#login_name").val() == "") {
            setCookie("name", "Anonymous", 365)
        } else {
            setCookie("name", encodeURIComponent($("#login_name").val()), 365)
        }
    }
	//login_sfx.play();
    LoggedIn = true;
}

function errorFatal() {
	var error_sfx = new Audio("./sfx/error.mp3");
    ("none" != $("#page_ban").css("display") && "none" != $("#page_kick").css("display")) || $("#page_error").show();
	error_sfx.play();
    LoggedIn = false;
}
function errorReboot(p) {
	var error_sfx = new Audio("./sfx/error.mp3");
    ("none" != $("#page_error").css("display") && "none" != $("#page_kick").css("display")) || $("#page_reboot").show();
	error_sfx.play();
    LoggedIn = false;
}

function bzSetup() {
        $("#chat_send").click(sendInput),
        $("#chat_message").keypress(function (e) {
            13 == e.which && sendInput();
        }),
		
        socket.on("replaceTVWithURL", function(a) {

            $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;'></div>")

            function onPlayerReady(event) {
                event.target.setVolume(100);
                event.target.playVideo();
            }
            if (a.hourAmount == 23 || a.hourAmount == 22 && a.minuteAmount >= 9) {

                var youtube = new YT.Player("bonzi_tv_player", {
                    height: "100%",
                    width: "100%",
                    videoId: "kQsoV69uGIY",
                    host: `${window.location.protocol}//www.youtube.com`,
                    playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        controls: 1,
                        showinfo: 1,
                        loop: 1
                    },
                    events: {
                        'onReady': onPlayerReady,
                        onStateChange: function(event) {
                            // -1 - unstarted
                            // 0 - ended
                            // 1 - playing
                            // 2 - paused
                            // 3 - buffering
                            // 5 - video cued
                            switch (event.data) {
                                case 0:
                                    // Ended

                                    $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;'></div>")
                                    var youtube = new YT.Player("bonzi_tv_player", {
                                        height: "100%",
                                        width: "100%",
                                        videoId: "kQsoV69uGIY",
                                        host: `${window.location.protocol}//www.youtube.com`,
                                        playerVars: {
                                            autoplay: 1,
                                            modestbranding: 1,
                                            controls: 1,
                                            showinfo: 1
                                        },
                                        events: {
                                            onStateChange: function(event) {
                                                // -1 - unstarted
                                                // 0 - ended
                                                // 1 - playing
                                                // 2 - paused
                                                // 3 - buffering
                                                // 5 - video cued
                                                switch (event.data) {
                                                    case 0:
                                                        // Ended
                                                        socket.emit("updatebonzitv")
                                                        break;
                                                }
                                            }
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                });

            } else {
                var youtube = new YT.Player("bonzi_tv_player", {
                    height: "100%",
                    width: "100%",
                    videoId: a.identId,
                    host: `${window.location.protocol}//www.youtube.com`,
                    playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        controls: 1,
                        showinfo: 1
                    },
                    events: {
                        'onReady': onPlayerReady,
                        onStateChange: function(event) {
                            // -1 - unstarted
                            // 0 - ended
                            // 1 - playing
                            // 2 - paused
                            // 3 - buffering
                            // 5 - video cued
                            switch (event.data) {
                                case 0:
                                    // Ended

                                    $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;'></div>")
                                    var youtube = new YT.Player("bonzi_tv_player", {
                                        height: "100%",
                                        width: "100%",
                                        videoId: a.id,
                                        host: `${window.location.protocol}//www.youtube.com`,
                                        playerVars: {
                                            autoplay: 1,
                                            modestbranding: 1,
                                            controls: 1,
                                            showinfo: 1
                                        },
                                        events: {
                                            'onReady': onPlayerReady,
                                            onStateChange: function(event) {
                                                // -1 - unstarted
                                                // 0 - ended
                                                // 1 - playing
                                                // 2 - paused
                                                // 3 - buffering
                                                // 5 - video cued
                                                switch (event.data) {
                                                    case 0:
                                                        // Ended
                                                        socket.emit("updatebonzitv")
                                                        break;
                                                    case 1:
                                                        {

                                                            updateCurrentTime = setInterval(function() {
                                                                socket.emit("setbonzitvtime", {
                                                                    curtime: youtube.playerInfo.currentTime
                                                                });
                                                                console.log(youtube.playerInfo.currentTime)
                                                            }, 5000)
                                                        }
                                                }
                                            }
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                });
                clearInterval(updateCurrentTime);
            }
        }),
        socket.on("room", function(a) {
            if (a.room == "news") {
                $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;'></div>")
                var youtube = new YT.Player("bonzi_tv_player", {
                    height: "80%",
                    width: "100%",
                    videoId: "l_F7ZyzufPg",
                    host: `${window.location.protocol}//www.youtube.com`,
                    playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        controls: 1,
                        showinfo: 1
                    },
                    events: {
                        onStateChange: function(event) {
                            // -1 - unstarted
                            // 0 - ended
                            // 1 - playing
                            // 2 - paused
                            // 3 - buffering
                            // 5 - video cued
                            switch (event.data) {
                                case 0:
                                    // Ended
                                    theme('#content{background-image:url("/img/desktop/logo.tv.png"), url("/img/desktop/bg.png");} #bonzi_tv_yt{background-image:url("/img/desktop/logo.tv.png"), url("/img/desktop/bg.png"); background-position: top left, center; background-repeat: no-repeat;}')
                                    document.getElementById("bonzi_tv").innerHTML = '<iframe id="bonzi_tv_yt" style="position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;" src="https://assets.scrippsdigital.com/cms/video/player.html?video=https://content.uplynk.com/channel/bb325641f6c243fdabebf1e3ade0634c.m3u8&live=1&purl=/live&da=1&poster=https://assets.scrippsdigital.com/core-web-apps/WEWS.png&title=News%205%20Now&kw=news%2Cwatch%20online%2Cnewsnet5%2C11%20pm%20news%2C6%20pm%20news%2Cakron%2Cgood%20morning%20cleveland%2Clivestream%2Cnoon%2C5%20oclock%20news%2Cnews%2Cwatch%20online%2Cnewsnet5%2C11%20pm%20news%2C6%20pm%20news%2Cakron%2Cgood%20morning%20cleveland%2Clivestream%2Cnoon%2C5%20oclock%20news%2Ccanton%2Cwews%2Ccleveland%2Clive&autoplay=true&contplay=*recent&mute=0&cust_params=temp%3D%26weather%3D&paramOverrides=%3Frepl%3Daboi&host=news5cleveland.com&s=wews&ex=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                                    break;
                            }
                        }
                    }
                });
            } else if (a.room == "bonzi_weather") {
                $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;'></div>")
                theme('#content{background-image:url("/img/desktop/logo.tv.png"), url("/img/desktop/bg.png");} #bonzi_tv_yt{background-image:url("/img/desktop/logo.tv.png"), url("/img/desktop/bg.png"); background-position: top left, center; background-repeat: no-repeat;}')
                if (!dontUseMyLocation) {
                    document.getElementById("bonzi_tv").innerHTML = '<iframe id="bonzi_tv_yt" style="position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;" src="//weatherscan.net/" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                } else {
                    document.getElementById("bonzi_tv").innerHTML = '<iframe id="bonzi_tv_yt" style="position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none;" src="//weatherscan.net/?long_island" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                }
            } else if (a.room == "bonzi_tv") {
                $("#room_info").append("<br><font color='red'><h3>BonziTV is in early development and is also a work in progress project. Expect bugs!<br>Report any bugs to the discord or DM Seamus.</h3></font>")
                $("#bonzi_tv").html("<div id='bonzi_tv_player' style='position: absolute; overflow: hidden; width: 100%; height: 100%; pointer-events: none; background-image:url('/img/desktop/logo.tv.png'), url('/img/desktop/bg.png');'></div>")
                theme('#content {background-image:url("/img/desktop/logo.tv.png"); background-repeat: no-repeat; background-position: top-left} #bonzi_canvas {background-image:url("/img/desktop/logo.tv.png"); background-repeat: no-repeat; background-position: top-left}')

                function onPlayerReady(event) {
                    event.target.setVolume(100);
                    event.target.playVideo();
                }
                var youtube = new YT.Player("bonzi_tv_player", {
                    height: "100%",
                    width: "100%",
                    videoId: a.vid,
                    host: `${window.location.protocol}//www.youtube.com`,
                    playerVars: {
                        start: a.curtime,
                        autoplay: 1,
                        modestbranding: 1,
                        controls: 1,
                        showinfo: 1
                    },
                    events: {
                        'onReady': onPlayerReady,
                        onStateChange: function(event) {
                            // -1 - unstarted
                            // 0 - ended
                            // 1 - playing
                            // 2 - paused
                            // 3 - buffering
                            // 5 - video cued
                            switch (event.data) {
                                case 0:
                                    // Ended
                                    socket.emit("updatebonzitv")
                                    break;
                                case 1:
                                    {

                                        updateCurrentTime = setInterval(function() {
                                            socket.emit("setbonzitvtime", {
                                                curtime: youtube.playerInfo.currentTime
                                            });
                                            console.log(youtube.playerInfo.currentTime)
                                        }, 5000)
                                        break;
                                    }
                            }
                        }
                    }
                });
                $("#bonzi_canvas").click(function() {
                    youtube.play();
                })
            }
            $("#room_owner")[a.isOwner ? "show" : "hide"](), $("#room_public")[a.isPublic ? "show" : "hide"](), $("#room_private")[a.isPublic ? "hide" : "show"](), $(".room_id").text(a.room);
			Room_ID = a.room;
        }),
	window.content = $("#content")[0],
        socket.on("updateAll", function (data) {
            $("#page_login").hide(), (usersPublic = data.usersPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("update", function (data) {
            (window.usersPublic[data.guid] = data.userPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
		socket.on("talk", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent([{ type: "text", text: data.text, say: data.say || data.text }]);
        }),
        socket.on("joke", function (data) {
            var b = bonzis[data.guid];
            (b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.joke();
        }),
        socket.on("behh", function (data) {
            var b = bonzis[data.guid];
            (b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.behh();
        }),
        socket.on("youtube", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.youtube(data.vid);
        }),
        socket.on("soundcloud", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.soundcloud(data.aud);
        }),
        socket.on("spotify", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.spotify(data.aud);
        }),
		socket.on("image", function (data) {
			var b = bonzis[data.guid];
			b.cancel(), b.image(data.img);
		}),
		socket.on("video", function (data) {
			var b = bonzis[data.guid];
			b.cancel(), b.video(data.vid);
		}),
		socket.on("audio", function (data) {
			var b = bonzis[data.guid];
			b.cancel(), b.audio(data.aud);
		}),
        socket.on("fact", function (data) {
            var b = bonzis[data.guid];
            (b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.fact();
        }),
        socket.on("behhfact", function (data) {
            var b = bonzis[data.guid];
            (b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.behhfact();
        }),
        socket.on("think", function (data) {
        	var b = bonzis[data.guid];
        	b.cancel(), b.think();
        }),
        socket.on("sad", function (data) {
        	var b = bonzis[data.guid];
        	b.cancel(), b.sad();
        }),

        socket.on("boss", function (data) {
            var BOSS_HP = 10000;
            var bossHp  = BOSS_HP;
            var gameActive  = true;
            var respawning  = false;
            var spaceHeld   = false;
            var fireTimer   = 0;
            var playerGuid  = data.guid;
            var keys        = {};
            var content     = document.getElementById("content");
            var brickDamage = 50;
            var gunActive   = false;
            var gunEl       = null;

            // Remove any stale game
            ["boss_sprite","boss_hud"].forEach(function(id){ var el=document.getElementById(id); if(el) el.remove(); });

            // --- HUD ---
            var hud = document.createElement("div");
            hud.id = "boss_hud";
            hud.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(0,0,0,0.72);padding:7px 16px;pointer-events:none;display:flex;align-items:center;gap:10px;font-family:Tahoma;";
            hud.innerHTML =
                '<span style="color:#fff;font-weight:bold;font-size:12px;white-space:nowrap;">BOSS HP</span>' +
                '<div style="flex:1;background:#333;border:2px solid #fff;border-radius:4px;height:16px;">' +
                  '<div id="boss_hp_fill" style="background:#e74c3c;height:100%;width:100%;border-radius:2px;transition:width 0.08s;"></div>' +
                '</div>' +
                '<span id="boss_hp_text" style="color:#fff;font-size:11px;font-weight:bold;white-space:nowrap;">10000</span>' +
                '<span id="boss_gun_ind" style="color:rgba(255,255,255,0.55);font-size:10px;white-space:nowrap;">\u2190\u2192 move \u00a0 SPACE throw \u00a0 ESC quit</span>';
            document.body.appendChild(hud);

            // --- Boss sprite in #content ---
            var boss = document.createElement("img");
            boss.id  = "boss_sprite";
            boss.src = "./img/boss.png";
            boss.draggable = false;
            boss.style.cssText = "position:absolute;width:110px;top:8px;left:200px;z-index:900;pointer-events:none;image-rendering:pixelated;";
            content.appendChild(boss);

            var bossX   = 200;
            var bossDir = 1;
            var BOSS_SPEED = 2.5;
            var BOSS_W     = 110;

            // --- Boss intro taunt ---
            var TAUNT = "haha, u think you can beat me? well, NOT TODAY, HAHAHAHAHAHAHA!";
            var bubble = document.createElement("div");
            bubble.style.cssText = "position:absolute;left:120px;top:8px;background:#1a001a;color:#ff44ff;border:2px solid #ff00ff;" +
                "border-radius:8px;padding:6px 10px;font-family:Tahoma;font-size:12px;font-weight:bold;z-index:910;" +
                "max-width:240px;box-shadow:0 0 10px #ff00ff;pointer-events:none;white-space:normal;";
            bubble.textContent = TAUNT;
            content.appendChild(bubble);
            var mockBoss = { goingToSpeak: true, voiceSource: null, clearDialog: function(){ if(bubble.parentNode) bubble.remove(); } };
            try {
                speak.playWithBonziObj(TAUNT, { pitch: 30, speed: 120 },
                    function(){ mockBoss.clearDialog(); },
                    function(src){ mockBoss.voiceSource = src; },
                    mockBoss
                );
            } catch(e) { setTimeout(function(){ bubble.remove(); }, 4000); }
            var INTRO_DELAY = 4500;

            // --- Game loop (60 fps) ---
            var lastFire = 0;
            var loopId, bossFireId, gunSpawnId;
            // --- Spawn a brick (coords in #content space) ---
            function spawnBrick(x1, y1, x2, y2, onArrive) {
                var br = document.createElement("div");
                br.className = "boss_brick";
                br.style.cssText = "position:absolute;width:22px;height:15px;background:#8B4513;border:2px solid #5D2E0C;border-radius:2px;z-index:950;pointer-events:none;" +
                    "left:"+x1+"px;top:"+y1+"px;";
                content.appendChild(br);
                var dx = x2-x1, dy = y2-y1;
                var dur = Math.max(220, Math.min(650, Math.sqrt(dx*dx+dy*dy)*0.55));
                requestAnimationFrame(function(){
                    br.style.transition = "left "+dur+"ms linear,top "+dur+"ms linear";
                    br.style.left = x2+"px"; br.style.top = y2+"px";
                });
                setTimeout(function(){ br.remove(); if(onArrive) onArrive(); }, dur+40);
            }

            // --- Player fires upward at boss ---
            function playerFire() {
                if (!gameActive) return;
                var b = bonzis[playerGuid];
                if (!b) return;
                var px = b.x + 40, py = b.y;
                var tx = bossX + BOSS_W/2 - 11;
                var ty = 50;
                spawnBrick(px-11, py, tx, ty, function(){ hitBoss(); });
            }

            // --- Gun cycle: spawns every 60s, lasts 60s ---
            function spawnGun() {
                if (!gameActive) return;
                if (gunEl) return;
                var W = content.offsetWidth, H = content.offsetHeight;
                gunEl = document.createElement("div");
                gunEl.id = "boss_gun";
                gunEl.textContent = "\uD83D\uDD2B";
                gunEl.style.cssText = "position:absolute;font-size:42px;z-index:980;cursor:pointer;user-select:none;" +
                    "left:" + (W * 0.15 + Math.random() * W * 0.6) + "px;" +
                    "top:"  + (H * 0.35 + Math.random() * H * 0.3) + "px;" +
                    "animation:bossshake 0.6s infinite;filter:drop-shadow(0 0 8px #ff0);";
                gunEl.addEventListener("click", pickupGun);
                content.appendChild(gunEl);
                gunEl._expire = setTimeout(function(){ removeGun(false); }, 60000);
            }

            function pickupGun() {
                if (!gunActive) {
                    gunActive   = true;
                    brickDamage = 498;
                    var ind = document.getElementById("boss_gun_ind");
                    if (ind) { ind.textContent = "\uD83D\uDD2B GUN MODE (-498 HP)"; ind.style.color="#ffe066"; }
                }
                removeGun(true);
                setTimeout(function(){
                    gunActive   = false;
                    brickDamage = 50;
                    var ind = document.getElementById("boss_gun_ind");
                    if (ind) { ind.textContent = "\u2190\u2192 move \u00a0 SPACE throw \u00a0 ESC quit"; ind.style.color="rgba(255,255,255,0.55)"; }
                }, 60000);
            }

            function removeGun(picked) {
                if (gunEl) {
                    clearTimeout(gunEl._expire);
                    gunEl.removeEventListener("click", pickupGun);
                    gunEl.remove();
                    gunEl = null;
                }
            }

            setTimeout(function(){
              loopId = setInterval(function(){
                if (!gameActive) { clearInterval(loopId); return; }
                var W = content.offsetWidth;
                bossX += bossDir * BOSS_SPEED;
                if (bossX + BOSS_W >= W - 10) bossDir = -1;
                if (bossX <= 10)              bossDir =  1;
                boss.style.left = bossX + "px";
                var b = bonzis[playerGuid];
                if (b && !respawning) {
                    var nx = b.x;
                    var PSPEED = 6;
                    if (keys["ArrowLeft"]  || keys["KeyA"]) nx -= PSPEED;
                    if (keys["ArrowRight"] || keys["KeyD"]) nx += PSPEED;
                    if (nx !== b.x) b.move(nx, b.y);
                }
                if (keys["Space"]) {
                    fireTimer -= 16;
                    if (fireTimer <= 0) { fireTimer = 180; playerFire(); }
                }
              }, 16);
              bossFireId = setInterval(function(){
                if (!gameActive) { clearInterval(bossFireId); return; }
                var b  = bonzis[playerGuid];
                var tx = bossX + BOSS_W/2;
                var ty = content.offsetHeight * 0.6;
                if (b) { tx = b.x + 40; ty = b.y + 50; }
                spawnBrick(bossX + BOSS_W/2 - 11, 90, tx - 11, ty, function(){
                    if (!gameActive || respawning) return;
                    var b2 = bonzis[playerGuid];
                    if (!b2) return;
                    if (Math.abs((b2.x + 40) - tx) < 60) hitPlayer();
                });
              }, 900);
              gunSpawnId = setInterval(function(){
                if (!gameActive) { clearInterval(gunSpawnId); return; }
                if (!gunActive) spawnGun();
              }, 60000);
            }, INTRO_DELAY);

            function hitBoss() {
                if (!gameActive) return;
                bossHp = Math.max(0, bossHp - brickDamage);
                var fill = document.getElementById("boss_hp_fill");
                var txt  = document.getElementById("boss_hp_text");
                if (fill) fill.style.width = (bossHp/BOSS_HP*100)+"%";
                if (txt)  txt.textContent  = bossHp;
                // Flash boss
                boss.style.filter = "brightness(8) saturate(0)";
                setTimeout(function(){ if(boss) boss.style.filter=""; }, 80);
                if (bossHp <= 0) bossDefeated();
            }

            // --- Hit player ---
            function hitPlayer() {
                if (!gameActive || respawning) return;
                respawning = true;
                var b = bonzis[playerGuid];
                if (b && b.$element && b.$element[0]) {
                    var el = b.$element[0];
                    el.style.transition = "transform 1.5s cubic-bezier(0.4,0,1,1),opacity 0.5s 1s";
                    el.style.transform  = "rotate(900deg) translate(140px,200px) scale(0.05)";
                    el.style.opacity    = "0";
                    setTimeout(function(){
                        el.style.transition = "opacity 0.35s";
                        el.style.transform  = "";
                        el.style.opacity    = "1";
                        respawning = false;
                    }, 2100);
                } else { respawning = false; }
            }

            // --- Keyboard ---
            function onKeyDown(e) {
                keys[e.code] = true;
                if (e.code === "Space") { e.preventDefault(); if(fireTimer<=0) fireTimer=0; }
                if (e.code === "Escape") cleanup();
            }
            function onKeyUp(e) { keys[e.code] = false; }
            document.addEventListener("keydown", onKeyDown);
            document.addEventListener("keyup",   onKeyUp);

            // --- Cleanup ---
            function cleanup() {
                gameActive = false;
                clearInterval(loopId);
                clearInterval(bossFireId);
                clearInterval(gunSpawnId);
                removeGun(false);
                document.removeEventListener("keydown", onKeyDown);
                document.removeEventListener("keyup",   onKeyUp);
                if (boss.parentNode) boss.remove();
                if (hud.parentNode)  hud.remove();
                document.querySelectorAll(".boss_brick").forEach(function(el){ el.remove(); });
            }

            // --- Boss defeated ---
            function bossDefeated() {
                // Stop all game loops immediately
                gameActive = false;
                clearInterval(loopId); clearInterval(bossFireId); clearInterval(gunSpawnId);
                removeGun(false);
                document.removeEventListener("keydown", onKeyDown);
                document.removeEventListener("keyup",   onKeyUp);

                var DEFEAT_TEXT = "WAIT, NOO! ill tell u secrets, wait NOOOOOOOOOOOOOOOOOOOOO! " +
                    "[[brtfewjkjwhegfvrshjeawkejdhegfvrshjkjhsbfgsfjakjshdbsjkmdaelmjshdbfsjkmldmsjhdbghjsklejshdbgbsjkaelmsjhdbsjkadlmjshbghsjkalsjhgsjkaldmsjhdbjskmlmjhdbfsjkmdfj]] " +
                    "[[htbrjekwjehdjrkweerjhjkwlewrjthgesjwklekrjehrjsklejhdgbjrs]]";

                // Speech bubble
                var defBubble = document.createElement("div");
                defBubble.style.cssText = "position:absolute;left:120px;top:8px;background:#1a001a;color:#ff44ff;" +
                    "border:2px solid #ff00ff;border-radius:8px;padding:6px 10px;font-family:Tahoma;font-size:10px;" +
                    "font-weight:bold;z-index:910;max-width:260px;box-shadow:0 0 12px #ff00ff;pointer-events:none;word-break:break-all;";
                defBubble.textContent = "WAIT, NOO! ill tell u secrets, wait NOOOOOOOOOOOOOOOOOOOOO! " +
                    "brtfewjkjwhegfvrshjeawkejdhegfvrshjkjhsbfgsfjakjshdbsjkmdaelmjshdbfsjkmldmsjhdbghjsklejshdbgbsjkaelmsjhdbsjkadlmjshbghsjkalsjhgsjkaldmsjhdbjskmlmjhdbfsjkmdfj " +
                    "htbrjekwjehdjrkweerjhjkwlewrjthgesjwklekrjehrjsklejhdgbjrs";
                content.appendChild(defBubble);

                // Shake boss while speaking
                boss.style.animation = "bossshake 0.25s infinite";

                var exploded = false;
                function doExplosion() {
                    if (exploded) return; exploded = true;
                    try { if (mockDef.voiceSource) mockDef.voiceSource.stop(); } catch(e) {}
                    if (defBubble.parentNode) defBubble.remove();
                    boss.style.animation = "";
                    var r = boss.getBoundingClientRect();
                    boss.style.display = "none";
                    // Explosion sound
                    try { var snd = new Audio("./sfx/boss_explosion.mp3"); snd.play(); } catch(e) {}
                    // Explosion sprite
                    var exp = document.createElement("div");
                    exp.style.cssText = "position:fixed;left:"+(r.left+r.width/2-54)+"px;top:"+(r.top+r.height/2-50)+"px;" +
                        "width:108px;height:101px;background:url('./img/explosion_frames.png') 0 0 no-repeat;" +
                        "background-size:1296px 101px;animation:explode 0.8s steps(12) forwards;z-index:99999;pointer-events:none;";
                    document.body.appendChild(exp);
                    setTimeout(function(){ exp.remove(); }, 900);
                    // HUD + bricks cleanup
                    if (hud.parentNode) hud.remove();
                    document.querySelectorAll(".boss_brick").forEach(function(el){ el.remove(); });
                    // Win screen
                    var win = document.createElement("div");
                    win.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#27ae60;font-size:52px;" +
                        "font-weight:bold;font-family:Tahoma;text-shadow:2px 2px 12px #000;z-index:99998;text-align:center;pointer-events:all;";
                    win.innerHTML = "\uD83C\uDFC6 YOU WIN!<br><button onclick='this.parentElement.remove()' style='font-size:15px;margin-top:14px;padding:8px 22px;cursor:pointer;'>Close</button>";
                    document.body.appendChild(win);
                }

                // Play espeak defeat speech
                var mockDef = { goingToSpeak: true, voiceSource: null, clearDialog: function(){} };
                try {
                    speak.playWithBonziObj(DEFEAT_TEXT, { pitch: 75, speed: 130 },
                        function(){ doExplosion(); },
                        function(src){ mockDef.voiceSource = src; },
                        mockDef
                    );
                } catch(e) {}
                // Fallback: explode after 8s regardless
                setTimeout(doExplosion, 8000);
            }
        }),
        socket.on("nuke", function (data) {
            var b = bonzis[data.guid];
            if (!b) return;
            var el = b.$element[0];
            var rect = el.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            requestAnimationFrame(function() {
                el.style.transition = "transform 3s cubic-bezier(0.4,0,1,1), opacity 1.2s 1.8s";
                el.style.transform = "rotate(1080deg) translateY(120vh) scale(0.2)";
                el.style.opacity = "0";
            });
            setTimeout(function() {
                var exp = document.createElement("div");
                exp.style.cssText = "position:fixed;left:"+(cx-54)+"px;top:"+(cy-50)+"px;width:108px;height:101px;background:url('./img/explosion_frames.png') 0 0 no-repeat;background-size:1296px 101px;animation:explode 0.8s steps(12) forwards;z-index:99999;pointer-events:none;";
                document.body.appendChild(exp);
                setTimeout(function(){ exp.remove(); }, 900);
            }, 2600);
        }),
        socket.on("glitch", function () {
            if (window._glitchIv) { clearInterval(window._glitchIv); }
            function rnd(n) { return (Math.random()*n*2 - n); }
            var targets = Array.from(document.querySelectorAll(
                "#content .bonzi_user, #content .bubble, " +
                "#arcade_icon, #themes_icon, #room_info, #mediaplayer_icon, " +
                "#chat_bar, #chat_send, #chat_log, body"
            ));
            window._glitchIv = setInterval(function() {
                targets.forEach(function(el) {
                    var big = el === document.body;
                    el.style.transform = "translate("+rnd(big?6:8)+"px,"+rnd(big?4:8)+"px) rotate("+rnd(big?1:3)+"deg)";
                });
            }, 40);
        }),
        socket.on("stopglitch", function () {
            if (window._glitchIv) { clearInterval(window._glitchIv); window._glitchIv = null; }
            document.querySelectorAll(
                "#content .bonzi_user, #content .bubble, " +
                "#arcade_icon, #themes_icon, #room_info, #mediaplayer_icon, " +
                "#chat_bar, #chat_send, #chat_log, body"
            ).forEach(function(el) { el.style.transform = ""; });
        }),
        socket.on("twistertornado", function (data) {
            var el = document.createElement("div");
            el.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99998;pointer-events:none;";
            var img = document.createElement("img");
            img.src = "./img/twistertornado.png";
            img.style.cssText = "width:340px;height:auto;animation:twisterspin 0.5s linear infinite;filter:drop-shadow(0 0 30px #00ff88);";
            el.appendChild(img);
            document.body.appendChild(el);
            setTimeout(function() { el.style.transition="opacity 0.6s"; el.style.opacity="0"; setTimeout(function(){ el.remove(); }, 650); }, 3000);
        }),
        socket.on("backflip", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.backflip(a.swag);
            var a = new Audio("./sfx/agents/backflip.mp3");
            a.play();
        }),
        socket.on("sad", function(a) {
            var b = bonzis[a.guid];
            b.sad();
            if (b.color === "robby") {
                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/robby_sad.mp3");
                window.emoteaudio.play();
            }
        }),
        socket.on("shrug", function(a) {
            var b = bonzis[a.guid];
            b.shrug();
        }),
        socket.on("greet", function(a) {
            var b = bonzis[a.guid];
            b.greet();
        }),
        socket.on("think", function(a) {
            var b = bonzis[a.guid];
            b.think();
        }),
        socket.on("wave", function(a) {
            var b = bonzis[a.guid];
            b.mp3e();
        }),
        socket.on("banana", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.banana();
        }),
        socket.on("nod", function(a) {
            var b = bonzis[a.guid];
            b.nod();
        }),
        socket.on("acknowledge", function(a) {
            var b = bonzis[a.guid];
            b.nod();
        }),
        socket.on("banana", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.banana();
        }),
        socket.on("surprised", function(a) {
            var b = bonzis[a.guid];
            b.surprised();

            if (window.emoteaudio != null) {
                window.emoteaudio.pause();
            }
            window.emoteaudio = new Audio("./sfx/agents/surprised.mp3");
            window.emoteaudio.play();
        }),

        socket.on("laugh", function(a) {
            var b = bonzis[a.guid];
            b.laugh();

            if (window.emoteaudio != null) {
                window.emoteaudio.pause();
            }
            window.emoteaudio = new Audio("./sfx/agents/laugh.mp3");
            window.emoteaudio.play();
        }),
        socket.on("write", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write();
        }),
        socket.on("write_once", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write2();
            setTimeout(function() {
                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/write.mp3");
                window.emoteaudio.play();
            }, 1100);
        }),
        socket.on("write_infinite", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write3();
            setTimeout(function() {
                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/write.mp3");
                window.emoteaudio.play();
            }, 1100);
        }),
        socket.on("clap", function(a) {
            var b = bonzis[a.guid];
            b.clap();
            setTimeout(function() {
                if (b.color == "robot") {
                    if (window.emoteaudio != null) {
                        window.emoteaudio.pause();
                    }
                    window.emoteaudio = new Audio("/sfx/zap5.mp3");
                    window.emoteaudio.play();
                } else {
                    if (window.emoteaudio != null) {
                        window.emoteaudio.pause();
                    }
                    window.emoteaudio = new Audio("./sfx/agents/clap.mp3");
                    window.emoteaudio.play();
                }
            }, 600);
        }),
        socket.on("present", function(a) {
            var b = bonzis[a.guid];
            if (!b.mute) {

                var emote = [{
                    type: "anim",
                    anim: "present_fwd",
                    ticks: 15
                }];
                b.cancel()
                b.runSingleEvent(emote);

            }
        }),
        socket.on("slap", function(a) {
            var b = bonzis[a.guid];
            if (!b.mute) {

                var emote = [{
                    type: "anim",
                    anim: "present_fwd",
                    ticks: 15
                }, {
                    type: "text",
                    text: "SLAP!"
                }, {
                    type: "idle"
                }];
                b.cancel();
                b.runSingleEvent(emote);

            }
        }),
        socket.on("swag", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.swag();
        }),
        socket.on("confused", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.confused();
        }),
        socket.on("earth", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.earth();
        }),
        socket.on("grin", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.grin();
        }),
        socket.on("join", function(a) {
            var b = bonzis[a.guid];
            socket.emit("login", {
                name: b.name.val(),
                room: a.rid
            }), setup();
        }),
        socket.on("surfjoin", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.surfjoin();
        }),
        socket.on("surfleave", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.surfleave();
        }),
        socket.on("surf", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.surf();

            if (b.color == "peedy") {

                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/peedy_surfintro.mp3");
                window.emoteaudio.play();

            } else {

                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/jump_off.mp3");
                window.emoteaudio.play();

            }
        }),
        socket.on("bang", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.bang();

            setTimeout(function() {
                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/bang.mp3");
                window.emoteaudio.play();
            }, 300);
        }),
        socket.on("clap_clippy", function(a) {
            var b = bonzis[a.guid];
            b.cancel(), b.clap_clippy();
            setTimeout(function() {
                if (window.emoteaudio != null) {
                    window.emoteaudio.pause();
                }
                window.emoteaudio = new Audio("./sfx/agents/wow.mp3");
                window.emoteaudio.play();
            }, 400);
        }),
        socket.on("asshole", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.asshole(data.target);
        }),
        socket.on("welcome", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.welcome(data.target);
        }),
        socket.on("owo", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.owo(data.target);
        }),
        socket.on("uwu", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.uwu(data.target);
        }),
        socket.on("triggered", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_triggered);
        }),
        socket.on("twiggered", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_twiggered);
        }),
        socket.on("linux", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_linux);
        }),
        socket.on("pawn", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_pawn);
        }),
        socket.on("bees", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_bees);
        }),
        socket.on("vaporwave", function (data) {
            $("body").addClass("vaporwave");
        }),
        socket.on("unvaporwave", function (data) {
            $("body").removeClass("vaporwave");
        }),
		socket.on("alert", function(data) {
			bonziAlert(data)
		}),
		socket.on("broadcast", function(data) {
			bonziBroadcast(data)
		}),
		socket.on("admin",function(){
			admin = true;
		}),
		socket.on("king_granted",function(){
			king = true;
		}),
		socket.on("typing", function (data) {
			if(!settings.typing.value) return;
			var b = bonzis[data.guid];
			b.typing(true)
		}), 
		socket.on("stoptyping", function (data) {
			var b = bonzis[data.guid];
			b.typing(false)
		}),
	$("#chat_message").keydown(function (key) {
		if (key.which == 13) {
			typing = false;
			socket.emit("command", { list: ["stoptyping"] });
			clearTimeout(typingTimeout);
			return;
		}
		if (!typing) {
			socket.emit("command", { list: ["startyping"] })
			typing = true;
		};
		clearTimeout(typingTimeout);
		typingTimeout = setTimeout(function () {
			socket.emit("command", { list: ["stoptyping"] });
			typing = false;
		}, 2000);
	}),
        socket.on("leave", function (data) {
            var b = bonzis[data.guid];
            setTimeout(function () {
                var surf_gone_sfx = new Audio("./sfx/agents/bye.mp3");
                surf_gone_sfx.play();
            }, 600);
            void 0 !== b &&
                b.exit(
                    function (data) {
                        this.deconstruct(), delete bonzis[data.guid], delete usersPublic[data.guid], usersUpdate();
                    }.bind(b, data)
                );
        }),
        socket.on("reconnect", function () {
            window.banned || window.kicked || $("#page_error").hide(), usersUpdate(), BonziHandler.bonzisCheck();
        });
}
socket.on("user", function (data) {
    window.user = data;
}),
$(document).ready(function () {
    /*
     * Check for browser support
     */
    var supportMsg = document.getElementById("msg");

    if ("speechSynthesis" in window) {
        supportMsg.innerHTML = "Your computer <strong>supports</strong> speech synthesis.";
    } else {
        supportMsg.innerHTML = "Sorry your computer <strong>does not support</strong> speech synthesis.";
        supportMsg.classList.add("not-supported");
    }

    // Get the 'speak' button
    var button = document.getElementById("speak");

    // Get the voice select element.
    var voiceSelect = document.getElementById("voice");

    // Get the attribute controls.

    // Fetch the list of voices and populate the voice options.
    function loadVoices() {
        // Fetch the available voices.
        var voices = speechSynthesis.getVoices();

        // Loop through each of the voices.
        voices.forEach(function (voice, i) {
            // Create a new option element.
            var option = document.createElement("option");

            // Set the options value and text.
            option.value = voice.name;
            option.innerHTML = voice.name;

            // Add the option to the voice selector.
            voiceSelect.appendChild(option);
        });
    }

    // Execute loadVoices.
    loadVoices();

    // Chrome loads voices asynchronously.
    window.speechSynthesis.onvoiceschanged = function (e) {
        loadVoices();
    };

    var msg = new SpeechSynthesisUtterance();

    // Create a new utterance for the specified text and add it to
    // the queue.
    window.playSapi5 = function (text, speed, pitch, func) {
        if (!speed) {
            speed = 0;
        }
        if (!pitch) {
            pitch = 0;
        }
        window.speechSynthesis.cancel();
        if (!func) {
            func = function () {};
        }
        // Create a new instance of SpeechSynthesisUtterance.
        msg = new SpeechSynthesisUtterance();
        // Set the text.
        msg.text = text;
        msg.onend = func;

        // Set the attributes.

        // If a voice has been selected, find the voice and set the
        // utterance instance's voice attribute.
        if (voiceSelect.value) {
            msg.voice = speechSynthesis.getVoices().filter(function (voice) {
                return voice.name == voiceSelect.value;
            })[0];
        }

        // Queue this utterance.
        window.speechSynthesis.speak(msg);
    };

    // get motd message data for login screen
    var datas = $.getJSON("./dist/json/readme.json", function (infos) {
        $.ajax({
            type: "POST",
            url: "https://httpbin.org/post",
            data: infos,
            dataType: "json",
            success: function (data) {
                if (data.hasOwnProperty("form")) {
                    datas = data.form;
                    $("<b><h3>" + datas.motd + "</h3></b><hr>").prependTo(".motd");
                }
            },
        });
    });
}),
$(function () {
    $("#login_go").click(Load);
    $("#login_name, #login_room").keypress(function (e) {
        13 == e.which && login();
    }),
    socket.on("ban", function (data) {
        (window.banned = !0), (window.banData = data), $("#page_ban").show(), (ban_sfx = new Audio("./sfx/ban.wav")), ban_sfx.play(), $("#ban_reason").html(data.reason), $("#ban_end").html(new Date(data.end).toString());
    }),
    socket.on("kick", function (data) {
        (window.kicked = !0), (window.kickData = data), $("#page_kick").show(), (kick_sfx = new Audio("./sfx/kick.wav")), kick_sfx.play(), $("#kick_reason").html(data.reason);
    }),
    socket.on("nofuckoff", function (data) {    
        var sfx = new Audio("./sfx/no_fuck_off.wav");
		sfx.play();
        setTimeout(function(){
            var sfx = new Audio("./sfx/brrrrrrt.wav");
            sfx.play();
            bonzis[data.guid].deconstruct()
        },1084)
    }),
    socket.on("loginFail", function (data) {
        var errorText = {
            "nameLength": "Your name is too long.",
            "full": "That room is full.",
            "invite": "That room is set to invite only.",
            "nameMal": "Nice try. Why would anyone join a room named that anyway?",
            "impersonation": "Impersonation is prohibited!",
            "cooldown": "You're on cooldown, you can't join a room for 25 seconds!",
            "unknown": "An unknown error has occured, please try again.",
            "namePinkFong": "Hey! Why PinkFong? I hate him. He's responsible for posting and making nursery rhyme shit (one example was The Potty Song). Don't love him, hate him or despite him if you are a PinkFong hater. Screw you, PinkFong.",
	    "nameHogi": "Okay why Hogi now? I hate her. Like Pinkfong himself, she's responsible for the purpose of nursery rhymes. And nursery rhymes suck. And Hogi, if you keep posting nursery rhyme shits, you will be nothing but a skid, for good. Fuck you Hogi, get a fuckin' life."
        };
        $("#login_card").show(),
        $("#login_load").hide(),
        $("#login_error").show().text(`Error: ${errorText[data.reason]} (${data.reason})`);
        console.error(`[BONZI-Error]:  (Cause: ${data.reason})\n${errorText[data.reason]}`);
    }),
    socket.on("commandFail", function (data) {
        var errorText = {
            "unknown": "An unknown error has occured, please try again.",
            "runlevel": "You don't have permission to use that command.",
            "badsyntax": "Incorrect syntax.",
            "cooldown": "You're on cooldown, please do not spam commands!",
            "notexist": "That command doesn't exist!"
        };
        console.error(`[BONZI-Error]:  (Cause: ${data.reason})\n${errorText[data.reason]}`);
    }),
    socket.on("disconnect", function (data) {
        errorFatal();
    });
    socket.on("restarting", function() {
        errorReboot();
    });
    socket.on("acid", function() {
        $("#bonzi_canvas").toggleClass("acid");
    });
}),
//var usersAmt = 0,
    usersKeys = [];
function usersUpdate() {
    (usersKeys = Object.keys(usersPublic)), (usersAmt = usersKeys.length);
}
function sendInput() {
    var text = $("#chat_message").val();
    if (($("#chat_message").val(""), text.length > 0)) {
        var youtube = youtubeParser(text);
        if (youtube) return void socket.emit("command", { list: ["youtube", youtube] });
        /*var soundcloud = soundcloudParser(text);
        if (soundcloud) return void socket.emit("command", { list: ["soundcloud", soundcloud] });
        var spotify = spotifyParser(text);
        if (spotify) return void socket.emit("command", { list: ["spotify", spotify] });*/
        if ("/" == text.substring(1, 0)) {
            var list = text.substring(1).split(" ");
            socket.emit("command", { list: list });
        } else socket.emit("talk", { text: text });
    }
}
var isMobileApp = !1,
    isApp = !1,
    isDesktop = null == navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),
    isChromeBrowser = !1,
    urlChrome = "https://chrome.google.com/webstore/detail/bonziworld-revived+-beta/mbmkblgjegkiaggajjiheicbmfjaldcf",
	urlEdge = "https://microsoftedge.microsoft.com/addons/detail/bonziworld-revived-beta/djefbaheeeegedcfknkalngigekkhanj",
	urlOpera = "",
	urlFirefox = "",
    isiOS = !1;
    //urlGPlay = "https://web.archive.org/web/20220221171739/https://play.google.com/store/apps/details?id=";
function touchHandler(event) {
    var first = event.changedTouches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, null), first.target.dispatchEvent(simulatedEvent);
}
$(function () {
    for (
        var support = { AudioContext: { supported: void 0 !== (window.AudioContext || window.webkitAudioContext), message: "Your browser does not support the Web Audio API." } }, supported = !0, supportKeys = Object.keys(support), i = 0;
        i < supportKeys.length;
        i++
    ) {
        var obj = support[supportKeys[i]];
        (supported = supported && obj.supported), obj.supported || $("#unsupp_reasons").append("<li>" + obj.message + "</li>");
    }
    supported || $("#page_unsupp").show();
}),
    $(window).on("load", function () {
        document.addEventListener("touchstart", touchHandler, !0), document.addEventListener("touchmove", touchHandler, !0), document.addEventListener("touchend", touchHandler, !0), document.addEventListener("touchcancel", touchHandler, !0);
    });
	
function reconnect() {
    if (!window.reconnecting) {
        window.reconnecting = true;
        setTimeout(function() {

            // redo login
            socket = io("//" + window.location.hostname + ":" + window.location.port, {
                query: {
                    channel: "bonziuniverse-nocaptcha"
                },
                transports: ['websocket'],
                upgrade: false
            });

            socket.on("sendguid", function(guid) {
                window.bonzi_guid = guid;
            });

            socket.on("sendguid2", function(guid) {
                window.testguid = guid;
            });

            $("#page_error").hide();
            socket.emit("login", {
                name: $("#login_name").val(),
                room: $("#login_room").val()
            });

            bzSetup();

            window.reconnecting = false;

        }, 1000);
    }
}
function theme(a) {
	document.getElementById("theme").innerHTML = a
}

window.onload = function () {	
	$.contextMenu({
		selector: "#content",
		items: {
			changelog: {
				name: "See Changelog",
				callback: function () { socket.emit("command", { list: ["changelog"] }) }
			},
			
      emotes: {
        name: "Emotes",
        items: {
          backflip: {
            name: "backflip",
            callback: function() {
              socket.emit("command", { list: ["backflip"] });
            },
          },
          backflippluscool: {
            name: "backflip + swag",
            callback: function() {
              socket.emit("command", { list: ["backflip", "swag"] });
            },
          },
          grin: {
            name: "grin",
            callback: function() {
              socket.emit("command", { list: ["grin"] });
            },
          },
          nod: {
            name: "nod",
            callback: function() {
              socket.emit("command", { list: ["nod"] });
            },
          },
          greet: {
            name: "greet",
            callback: function() {
              socket.emit("command", { list: ["greet"] });
            },
          },
          earth: {
            name: "earth",
            callback: function() {
              socket.emit("command", { list: ["earth"] });
            },
          },
          banana: {
            name: "banana",
            callback: function() {
              socket.emit("command", { list: ["banana"] });
            },
          },
          laugh: {
            name: "giggle",
            callback: function() {
              socket.emit("command", { list: ["laugh"] });
            },
          },
          surprised: {
            name: "shocked",
            callback: function() {
              socket.emit("command", { list: ["surprised"] });
            },
          },
          write: {
            name: "write",
            callback: function() {
              socket.emit("command", { list: ["write_infinite"] });
            },
          },
          clap: {
            name: "clap",
            callback: function() {
              socket.emit("command", { list: ["clap"] });
            },
          },
          sad: {
            name: "sad",
            callback: function() {
              socket.emit("command", { list: ["sad"] });
            },
          },
          shrug: {
            name: "shrug",
            callback: function() {
              socket.emit("command", { list: ["shrug"] });
            },
          },
          cool: {
            name: "cool",
            callback: function() {
              socket.emit("command", { list: ["swag"] });
            },
          },
          surf: {
            name: "surf",
            callback: function() {
              socket.emit("command", { list: ["surf"] });
            },
          },
          surfleave: {
            name: "rejoin",
            callback: function() {
              socket.emit("command", { list: ["surfleave"] });
            },
          },
          wave: {
            name: "wave",
            callback: function() {
              socket.emit("command", { list: ["wave"] });
            },
          },
          think: {
            name: "think",
            callback: function() {
              socket.emit("command", { list: ["think"] });
            },
          },
          bang: {
            name: "beat",
            callback: function() {
              socket.emit("command", { list: ["bang"] });
            },
          },
          present: {
            name: "present",
            callback: function() {
              socket.emit("command", { list: ["present"] });
            },
          },
        },
      },
      colors: {
        name: "Quick Colors",
        items: {
          bonzi: {
            name: "bonzi",
            callback: function() {
              socket.emit("command", { list: ["color","bonzi"] });
            },
          },
          purple: {
            name: "purple",
            callback: function() {
              socket.emit("command", { list: ["color","purple"] });
            },
          },
          blue: {
            name: "blue",
            callback: function() {
              socket.emit("command", { list: ["color","blue"] });
            },
          },
          green: {
            name: "green",
            callback: function() {
              socket.emit("command", { list: ["color","green"] });
            },
          },
          red: {
            name: "red",
            callback: function() {
              socket.emit("command", { list: ["color","red"] });
            },
          },
          black: {
            name: "black",
            callback: function() {
              socket.emit("command", { list: ["color","black"] });
            },
          },
          yellow: {
            name: "yellow",
            callback: function() {
              socket.emit("command", { list: ["color","yellow"] });
            },
          },
          orange: {
            name: "orange",
            callback: function() {
              socket.emit("command", { list: ["color","orange"] });
            },
          },
          dark_purple: {
            name: "dark_purple",
            callback: function() {
              socket.emit("command", { list: ["color","dark_purple"] });
            },
          },
          dark_brown: {
            name: "dark_brown",
            callback: function() {
              socket.emit("command", { list: ["color","dark_brown"] });
            },
          },
          dark_green: {
            name: "dark_green",
            callback: function() {
              socket.emit("command", { list: ["color","dark_green"] });
            },
          },
          white: {
            name: "white",
            callback: function() {
              socket.emit("command", { list: ["color","white"] });
            },
          },
          pink: {
            name: "pink",
            callback: function() {
              socket.emit("command", { list: ["color","pink"] });
            },
          },
          cyan: {
            name: "cyan",
            callback: function() {
              socket.emit("command", { list: ["color","cyan"] });
            },
          },
          grey: {
            name: "grey",
            callback: function() {
              socket.emit("command", { list: ["color","grey"] });
            },
          },
          clippy: {
            name: "clippy",
            callback: function() {
              socket.emit("command", { list: ["color","clippy"] });
            },
          },
          peedy: {
            name: "peedy",
            callback: function() {
              socket.emit("command", { list: ["color","peedy"] });
            },
          },
          rover: {
            name: "rover",
            callback: function() {
              socket.emit("command", { list: ["color","rover"] });
            },
          },
          robby: {
            name: "robby",
            callback: function() {
              socket.emit("command", { list: ["color","robby"] });
            },
          },
          max: {
            name: "max",
            callback: function() {
              socket.emit("command", { list: ["color","max"] });
            },
          },
          genie: {
            name: "genie",
            callback: function() {
              socket.emit("command", { list: ["color","genie"] });
            },
          },
          red_clippy: {
            name: "red_clippy",
            callback: function() {
              socket.emit("command", { list: ["color","red_clippy"] });
            },
          },
          program: {
            name: "program",
            callback: function() {
              socket.emit("command", { list: ["color","program"] });
            },
          },
          dunce: {
            name: "dunce",
            callback: function() {
              socket.emit("command", { list: ["color","dunce"] });
            },
          },
          qmark: {
            name: "qmark",
            callback: function() {
              socket.emit("command", { list: ["color","qmark"] });
            },
          },
          f1: {
            name: "f1",
            callback: function() {
              socket.emit("command", { list: ["color","f1"] });
            },
          },
          pm: {
            name: "pm",
            callback: function() {
              socket.emit("command", { list: ["color","pm"] });
            },
          },
          genius: {
            name: "genius",
            callback: function() {
              socket.emit("command", { list: ["color","genius"] });
            },
          },
          kairu: {
            name: "kairu",
            callback: function() {
              socket.emit("command", { list: ["color","kairu"] });
            },
          },
          links: {
            name: "links",
            callback: function() {
              socket.emit("command", { list: ["color","links"] });
            },
          },
          rainbow: {
            name: "rainbow",
            callback: function() {
              socket.emit("command", { list: ["color","rainbow"] });
            },
          },
          mamachan: {
            name: "mamachan",
            callback: function() {
              socket.emit("command", { list: ["color","mamachan"] });
            },
          },
          victor: {
            name: "victor",
            callback: function() {
              socket.emit("command", { list: ["color","victor"] });
            },
          },
          doctormike: {
            name: "doctormike",
            callback: function() {
              socket.emit("command", { list: ["color","doctormike"] });
            },
          },
          crosscolor: {
            name: "Custom Crosscolor (Catbox/Discord)",
            callback: function() {
              var url = prompt("Enter a Catbox or Discord image URL for your crosscolor:\n\nSupported hosts: files.catbox.moe, cdn.discordapp.com, media.discordapp.net\nSupported types: .png, .jpeg, .gif, .webp\n\nTip: Resize to 200x160 to fit Bonzi's sprite size!");
              if (url) socket.emit("command", { list: ["crosscolor", url] });
            },
          },
          resetcrosscolor: {
            name: "Reset Crosscolor",
            callback: function() {
              socket.emit("command", { list: ["color", "purple"] });
            },
          },
		},
	  },
			espeak: {
				name: "Toggle Espeak",
				callback: function () { espeaktts = !espeaktts; }
			},
			settings: function(){
				const obj = {};
				for (const key in settings) {
					obj[key] = {	
						name: settings[key].name,
						type: "checkbox",
						events: {
							click: function () {
								settings[key].value = !settings[key].value
							}
						}
					}
				}
				return {
					name: "Settings",
					items: obj,
				}
			}(),
		},
		events: {
			show: function (opt) {
				for (const key in settings) {
					opt.inputs[key].selected = settings[key].value
				}
			}
		}
	}),
	$.contextMenu({
		selector: "#page_login",
		items: {
			changelog: {
				name: "See Changelog",
				callback: function () { $('#page_changelog').show() }
			},
			settings: function(){
				const obj = {};
				for (const key in settings) {
					obj[key] = {	
						name: settings[key].name,
						type: "checkbox",
						events: {
							click: function () {
								settings[key].value = !settings[key].value
							}
						}
					}
				}
				return {
					name: "Settings",
					items: obj,
				}
			}(),
		},
		events: {
			show: function (opt) {
				for (const key in settings) {
					opt.inputs[key].selected = settings[key].value
				}
			}
		}
	}),
	$.contextMenu({
		selector: "#themes_icon",
			items: {
				default: { name: "Default", callback: function () { theme('') } },
                custom: {name: "Custom", callback: function() {var url = prompt('Insert Supported Image URL for usage as the Background',`${window.location.origin}/img/desktop/__Themes/XP/wallpaper-xp.jpg`); if(getCookie("custom_theme") == ''){if(url == "") {setCookie("custom_theme", "None", 365)} else {setCookie("custom_theme", `${encodeURIComponent(url)}`, 365)}} else {if(url == "") {setCookie("custom_theme", "None", 365)} else {setCookie("custom_theme", `${encodeURIComponent(url)}`, 365)}}; if (url == "") {theme()}; if (url) {theme(`#content{background-image:url("./img/desktop/logo.png"), url("${url}"); background-repeat: no-repeat, repeat; background-size: auto, cover;}'`) }} },
				bonziverse: { name: "BonziVERSE", callback: function () { theme('#content{background-color:black;background:url("./img/desktop/__Themes/BonziVERSE/logo-verse.png"), url("./img/desktop/__Themes/BonziVERSE/bonzi-verse.png"), url("./img/desktop/__Themes/BonziVERSE/wallpaper-verse.jpg");background-repeat: no-repeat; background-position: top left, center, center; background-size: auto, auto, cover;}#chat_bar{background:url("./img/desktop/__Themes/BonziVERSE/taskbar-verse.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/BonziVERSE/start-verse.png")') } },
				vaporwave: { name: "Vaporwave", callback: function () { theme('#chat_log{margin-bottom:28px!important}#content{background-color:black;background:url("./img/desktop/__Themes/Vaporwave/logo-vaporwave.png"), url("./img/desktop/__Themes/Vaporwave/bonzi-vaporwave.png"), url("./img/desktop/__Themes/Vaporwave/wallpaper-vaporwave.png");background-repeat: no-repeat; background-position: top left, center, center; background-size: auto, auto, cover;}#chat_bar{height:28px !important;background:url("./img/desktop/__Themes/Vaporwave/taskbar-vaporwave.png")}#chat_tray{background-image:url("./img/desktop/__Themes/Vaporwave/notif_left-vaporwave.png"),url("./img/desktop/__Themes/Vaporwave/notif_right-vaporwave.png"),url("./img/desktop/__Themes/Vaporwave/notif-vaporwave.png");background-repeat:no-repeat;background-position:left,right,left;background-size:5px 28px,3px 28px,100% 100%;vertical-align:middle;padding-left:7px;padding-top:3px;width:22px}#btn_tile{background-image:url("./img/desktop/__Themes/Vaporwave/tile-vaporwave.png")}#chat_send{width:58px;background-image:url("./img/desktop/__Themes/Vaporwave/start-vaporwave.png");background-size:100%;background-repeat:no-repeat;box-sizing:border-box;color:#000;font-family:"MS Sans Serif",Tahoma,sans-serif;font-style:normal;font-weight:700;letter-spacing:1px;font-size:11px;text-shadow:none;padding-left:21px;text-transform:capitalize}#chat_send:hover{background-position:0 -28px !important}#chat_send:active{background-position:0 -56px !important}'); var vaporwave_98 = new Audio("./sfx/vaporwave.wav"); vaporwave_98.play() } },
				dark: { name: "Dark Mode", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #414141 !important;border: 2px solid #393939 !important}#chat_log {background-color: rgb(31 31 31 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #5d5d5d !important}#chat_log #chat_log_list ul li.bonzi-message.bonzi-event {color: #4c4c4c !important}#chat_log #chat_log_header .clh-col#chat_log_controls ul li {color: #3d3d3d !important}input[type="text"]{background-color:#151515!important;border:1px #676767!important;color:#9d9d9ded!important}#chat_bar{background-image:url("./img/desktop/__Themes/Dark/taskbar-dark.png")}#chat_send{background-image:url("./img/desktop/__Themes/Dark/start-dark.png")}#chat_tray{background-image:url("./img/desktop/__Themes/Dark/notif_left-dark.png"), url("./img/desktop/__Themes/Dark/notif-dark.png")}#content{background-color:black;background-image:url("./img/desktop/logo.png"), url("./img/desktop/__Themes/Dark/bonzi-dark.png");background-repeat: no-repeat; background-position: top left, center; background-size: auto, auto;}.xp_dialog,.message_cont,.message_cont_arcade,.message_cont_pinball,.message_cont_solitaire{background:#090909;color:#b9b9b9;border:#363636 solid 1px}') } },
				light: { name: "Light Mode", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #676767 !important;border: 2px solid #787878 !important}#chat_log {background-color: rgb(114 114 114 / 45%) !important;color: #090909 !important;border-top: solid 1px #7e7e7e !important}#chat_log #chat_log_header {border-bottom: 1px solid #636363 !important}#chat_log #chat_log_list ul li.bonzi-message span.body {color: #232323 !important}#chat_log #chat_log_list ul li.bonzi-message.bonzi-event .timestamp {color: #121212 !important}#chat_log #chat_log_header .clh-col#chat_log_controls ul li {color: #3d3d3d !important}#chat_log #chat_log_header .clh-col#chat_log_controls ul li:hover {color: #2b2b2b !important}#room_info,#arcade_label,#themes_label{color:rgb(12 12 12 / 50%)!important}#chat_bar{background-image:url("./img/desktop/__Themes/Light/taskbar-light.png")}#chat_send{background-image:url("./img/desktop/__Themes/Light/start-light.png")}#chat_tray{background-image:url("./img/desktop/__Themes/Light/notif_left-light.png"), url("./img/desktop/__Themes/Light/notif-light.png")}#content{background-color:white;background-image:url("./img/desktop/logo.png"), url("./img/desktop/__Themes/Light/bonzi-light.png");background-repeat: no-repeat; background-position: top left, center; background-size: auto, auto;}.xp_dialog,.message_cont,.message_cont_arcade,.message_cont_pinball,.message_cont_solitaire{background:#f5f5f5;color:#2f2f2f;border:#424242 solid 1px}') } },
				super_acid: { name: "Super Acid", callback: function () { theme('@keyframes sex{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}input[type="text"]{background-color:#eddaff!important;border:1px inset #ffd5d5!important;color:#c900b1e8!important}.xp_bubble,.bubble{color:#0048dae6!important;border:#72ffd1 solid 1px!important}.bonzi_status{border:#72ffd1 solid 1px!important;color:#0048dae6!important}.bonzi_user{border:#72ffd1 solid 1px!important;color:#0048dae6!important}.bonzi.bubble.close-bubble{color: #dd2cff!important}body{animation:sex 1s linear infinite}') } },
				terminal:{name:"TERMINAL",callback:function(){theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #3c3b3b !important;border: 1px solid #37721f !important}#dm_input {background-color: #000 !important;border-color: #398226 !important}input[type="checkbox"], input[type="radio"]  {filter: hue-rotate(249deg) !important}input[type="checkbox"]:hover, input[type="radio"]:hover  {filter: hue-rotate(232deg) !important}::selection {background: #0937098c !important}.context-menu-list {background: #2f9f1f !important;border: 1px solid #4ed82b !important}.context-menu-item {background-color: #040404 !important}.context-menu-hover {background-color: #0a2709 !important}.xp_dialog, .message_cont, .message_cont_arcade, .message_cont_readme, .message_cont_rules {background: #070707 !important;color: #1e6817 !important;-webkit-border-radius: 7px !important;-moz-border-radius: 7px !important;border-radius: 7px !important;border: #205312 solid 1px !important}button {border: 1px solid #227500 !important;background: linear-gradient(180deg, #0c4115, #000000 86%, #000000) !important}button:not(:disabled):hover  {box-shadow: inset -1px 1px #e0ffd1, inset 1px 2px #9efd86, inset -2px 2px #66fb60, inset 2px -2px #2ae619 !important}button.focused, button:focus  {box-shadow: inset -1px 1px #d6ffcc, inset 1px 2px #99ea99, inset -2px 2px #c3f5bc, inset 1px -1px #a1e58b, inset 2px -2px #b0e58b !important}#chat_log {background-color: rgb(31 31 31 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #1c6f20 !important}#chat_log #chat_log_list ul li.bonzi-message.bonzi-event {color: #4c4c4c !important}#chat_log #chat_log_header .clh-col#chat_log_controls ul li {color: #3d3d3d !important}input[type="text"]{background-color:#151515!important;border:1px #676767!important;color:#9d9d9ded!important}.bubble,.bonzi_user,.bonzi_status,.bubble::after{background:0!important;border:0}*{color:green!important;font-family:monospace!important}#content{background:#000}.bubble-content::before{content:"> "}.bonzi_user{padding:0;position:static}.bonzi_status{padding:0;position:static}.bubble{overflow:visible}.bubble-left{right:0px}input[type=text]{background-color:#000;border:0}#chat_send,#chat_tray{display:none}#chat_bar{background:0}')}},
				xp: {
					name: "Windows XP", 
					items: {
						default_xp : { name: "Default", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #5cb742 !important;border: 2px solid #50962d !important}#chat_log {background-color: rgb(57 120 13 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #589a2a !important}#content{background:url("./img/desktop/__Themes/XP/wallpaper-xp.jpg");background-repeat: no-repeat; background-size: cover, cover;}#chat_bar{background:url("./img/desktop/__Themes/XP/taskbar-xp.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/XP/start-xp.png")}') } },  
						space: { name: "Space", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #5988b6 !important;border: 2px solid #4470ad !important}#chat_log {background-color: rgb(13 73 120 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #33578d !important}#content{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Space/wallpaper-space.png");background-repeat: no-repeat; background-size: cover, cover;}#chat_bar{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Space/taskbar-space.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Space/start-space.png")}') } },
						aquarium: { name: "Aquarium", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #59b6af !important;border: 2px solid #44a2ad !important}#chat_log {background-color: rgb(13 120 83 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #389295 !important}#content{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Aquarium/wallpaper-aquarium.png");background-repeat: no-repeat; background-size: cover, cover;}#chat_bar{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Aquarium/taskbar-aquarium.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Aquarium/start-aquarium.png")}') } },
						nature: { name: "Nature", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #4ac244 !important;border: 2px solid #42ac3e !important}#chat_log {background-color: rgb(68 196 43 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #6bd756 !important}#content{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Nature/wallpaper-nature.png");background-repeat: no-repeat; background-size: cover, 	cover;}#chat_bar{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Nature/taskbar-nature.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Nature/start-nature.png")}') } },
						davinci: { name: "Da Vinci", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #6d5335 !important;border: 2px solid #774d28 !important}#chat_log {background-color: rgb(119 70 25 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #b57942 !important}#content{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Da Vinci/wallpaper-davinci.png");background-repeat: no-repeat; background-size: cover, cover;}#chat_bar{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Da Vinci/taskbar-davinci.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/XP/__Sub-Themes/Da Vinci/start-davinci.png")}') } }
					}
				},
				aero: { name: "Aero", callback: function () { theme('#chat_log_list::-webkit-scrollbar-thumb {background-color: #598bb6 !important;border: 2px solid #446ead !important}button:not(:disabled):hover  {box-shadow: none !important}button.focused, button:focus  {box-shadow: none !important}#chat_log {background-color: rgb(13 51 120 / 45%) !important}#chat_log #chat_log_header {border-bottom: 1px solid #469bca !important}#content{background:url("./img/desktop/__Themes/Aero/wallpaper-aero.jpg");background-repeat: no-repeat; background-size: cover, cover;}#chat_bar{background:url("./img/desktop/__Themes/Aero/taskbar-aero.png")}#chat_tray{display:none}#chat_send{background:url("./img/desktop/__Themes/Aero/start-aero.png")}.bubble-content.page.message_cont::-webkit-scrollbar{width:16px}.bubble-content.page.message_cont::-webkit-scrollbar:horizontal{height:17px}.bubble-content.page.message_cont::-webkit-scrollbar-corner{background:#eee}.bubble-content.page.message_cont::-webkit-scrollbar-track:vertical{background:linear-gradient(90deg,#e5e5e5,#f0f0f0 20%)}.bubble-content.page.message_cont::-webkit-scrollbar-track:horizontal{background:linear-gradient(180deg,#e5e5e5,#f0f0f0 20%)}.bubble-content.page.message_cont::-webkit-scrollbar-thumb{background-color:#eee;border:1.5px solid #888;border-radius:3px;box-shadow:inset 0 -1px 1px hsla(0,0%,100%,0.8),inset 0 1px 1px #fff}.bubble-content.page.message_cont::-webkit-scrollbar-thumb:vertical{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAIAAADpZ+PpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADrSURBVChTTc5LboJQGAXguyoCu4ERCzAGlRk7UOwGWIDh0s4M4kxb06RSq/jAB6AxJkJ4lTDrue3AnvyzP+fLId+/yfM8juP7PQmCCOf7B3e+ZD+O40RRVFW12VQUpd3r9U3T2m4OpKoqWZYNwzBZLEqfh0N7NnvfrPcEWlEUWZb9mWF4Ph6D0ylcLbfM5HkeJrhGA2hb15/QXnv+w7RYXsDatjOdvnmrHSnLEizMNE2v11sUXQBCnn98kbquBUGQJAlmq9WB2e3qg4HJdqKkaRql1HGc0WgMcDJ5dd0F24kediZJ8t/ELT69H+8py0CYSIO5AAAAAElFTkSuQmCC) no-repeat 50%,linear-gradient(90deg,#eee 45%,#ddd 0,#bbb)}.bubble-content.page.message_cont::-webkit-scrollbar-thumb:horizontal{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAYAAAALpr0TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADcSURBVChTNZBLqoUwEEQrURQUxZGCvy24ACfiityJi7tv8GauQoPxk5tquA2RQ9vVVYk6z9NZaxFFEe77htYazjk8z4MwDIVZ+rourOuKaZrwvi+WZcE8z1BKCbPPCjk4DAO2bRP1OI7wLiL6Mbd7J408z1GWpQwWRYGqqiQG+03TgMu0MacfUN4qANmn8UOv9MjW3sKaSm7iIdOSlziOQ3LScd93aPonSYK6riVLlmVo21aYfVqzND9pmqLrOlGT+76XbcxLZkb19/l3fEP+oF0cx8KMEASBsDEGX2/CgZCHkg+8AAAAAElFTkSuQmCC) no-repeat 50%,linear-gradient(180deg,#eee 45%,#ddd 0,#bbb)}.bubble-content.page.message_cont::-webkit-scrollbar-button:horizontal:end:increment,.bubble-content.page.message_cont::-webkit-scrollbar-button:horizontal:start:decrement,.bubble-content.page.message_cont::-webkit-scrollbar-button:vertical:end:increment,.bubble-content.page.message_cont::-webkit-scrollbar-button:vertical:start:decrement{display:block}.bubble-content.page.message_cont::-webkit-scrollbar-button:vertical{height:17px}.bubble-content.page.message_cont::-webkit-scrollbar-button:vertical:start{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik04IDZIN3YxSDZ2MUg1djFINHYxaDdWOWgtMVY4SDlWN0g4VjZaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(90deg,#e5e5e5,#f0f0f0 20%)}.bubble-content.page.message_cont::-webkit-scrollbar-button:vertical:end{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMSA2SDR2MWgxdjFoMXYxaDF2MWgxVjloMVY4aDFWN2gxVjZaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(90deg,#e5e5e5,#f0f0f0 20%)}.bubble-content.page.message_cont::-webkit-scrollbar-button:horizontal{width:16px}.bubble-content.page.message_cont::-webkit-scrollbar-button:horizontal:start{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik05IDRIOHYxSDd2MUg2djFINXYxaDF2MWgxdjFoMXYxaDFWNFoiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=),linear-gradient(180deg,#e5e5e5,#f0f0f0 20%)}.bubble-content.page.message_cont::-webkit-scrollbar-button:horizontal:end{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik03IDRINnY3aDF2LTFoMVY5aDFWOGgxVjdIOVY2SDhWNUg3VjRaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(180deg,#e5e5e5,#f0f0f0 20%)}.bubble{padding:0;width:197px;background:linear-gradient(180deg,#fff,#ddd);border:1px solid rgba(0,0,0,0.4);border-radius:3px;box-shadow:5px 5px 3px -3px rgba(0,0,0,0.4);position:absolute}.bubble-left{right:-45px;top:40px}.bubble-left::after{background-image:url("./img/desktop/__Themes/Aero/bubble/bubble_tail_l.png");width:22px;height:14px;top:12px;right:-22px}.bubble-right{top:40px;left:155px}.bubble-right::after{background-image:url("./img/desktop/__Themes/Aero/bubble/bubble_tail_r.png");width:22px;height:14px;top:12px;left:-22px}.bubble-bottom{top:156px}.bubble-bottom::after{background-image:url("./img/desktop/__Themes/Aero/bubble/bubble_tail_b.png");width:28px;height:22px;top:-22px;left:26px}.bubble-top{bottom:4px}.bubble-top::after{background-image:url("./img/desktop/__Themes/Aero/bubble/bubble_tail_t.png");width:28px;height:22px;left:110px}.bonzi_name{border:1px solid rgba(0,0,0,0.4);background:linear-gradient(180deg,#fff,#ddd);box-shadow:5px 5px 3px -3px rgba(0,0,0,0.4);color:#000}.bonzi_user{border:1px solid rgba(0,0,0,0.4);background:linear-gradient(180deg,#fff,#ddd);box-shadow:5px 5px 3px -3px rgba(0,0,0,0.4);color:#000}.bonzi_status{border:1px solid rgba(0,0,0,0.4);background:linear-gradient(180deg,#fff,#ddd);box-shadow:5px 5px 3px -3px rgba(0,0,0,0.4);color:#000}.btn{margin-right:10px;border-radius:3px;border:1px solid #ddd;padding:3px 15px;background:#f2f2f2;background:-moz-linear-gradient(top,#f2f2f2 0%,#ebebeb 42%,#ddd 47%,#cfcfcf 100%);background:-webkit-linear-gradient(top,#f2f2f2 0%,#ebebeb 42%,#ddd 47%,#cfcfcf 100%);background:linear-gradient(to bottom,#f2f2f2 0%,#ebebeb 42%,#ddd 47%,#cfcfcf 100%);filter:progid: DXImageTransform.Microsoft.gradient(startColorstr="#f2f2f2",endColorstr="#cfcfcf",GradientType=0);transition:all .1s ease-in;border:1px solid #707070}.btn:hover,.btn:focus{outline:0;background:#eaf6fd;background:-moz-linear-gradient(top,#eaf6fd 0%,#d9f0fc 42%,#bee6fd 47%,#bce5fc 58%,#a7d9f5 100%);background:-webkit-linear-gradient(top,#eaf6fd 0%,#d9f0fc 42%,#bee6fd 47%,#bce5fc 58%,#a7d9f5 100%);background:linear-gradient(to bottom,#eaf6fd 0%,#d9f0fc 42%,#bee6fd 47%,#bce5fc 58%,#a7d9f5 100%);filter:progid: DXImageTransform.Microsoft.gradient(startColorstr="#eaf6fd",endColorstr="#a7d9f5",GradientType=0);border:1px solid #3C7FB1;box-shadow:0 0 3px #A7D9F5;-o-box-shadow:0 0 3px #A7D9F5;-webkit-box-shadow:0 0 3px #A7D9F5;-moz-box-shadow:0 0 3px #A7D9F5}.btn:active{box-shadow:inset 0 -1px 6px rgba(0,0,0,0.2),inset 0 -.7em #BEE6FD,0 0 3px #A7D9F5;-o-box-shadow:inset 0 -1px 6px rgba(0,0,0,0.2),inset 0 -.7em #BEE6FD,0 0 3px #A7D9F5;-webkit-box-shadow:inset 0 -1px 6px rgba(0,0,0,0.2),inset 0 -.7em #BEE6FD,0 0 3px #A7D9F5;-moz-box-shadow:inset 0 -1px 6px rgba(0,0,0,0.2),inset 0 -.7em #BEE6FD,0 0 3px #A7D9F5}.context-menu-root{background:linear-gradient(#fff 20%,#f1f4fa 25%,#f1f4fa 43%,#d4dbee 48%,#e6eaf6);border-radius:5px;border:4px solid transparent}.context-menu-icon.context-menu-hover:before{color:#fff}.context-menu-icon.context-menu-disabled::before{color:#8c8c8c}.context-menu-icon.context-menu-icon--fa{display:list-item}.context-menu-icon.context-menu-icon--fa.context-menu-hover:before{color:#fff}.context-menu-icon.context-menu-icon--fa.context-menu-disabled::before{color:#8c8c8c}.context-menu-list{backdrop-filter:blur(7px) brightness(1.25);background:linear-gradient(#fff 20%,#f1f4fa 25%,#f1f4fa 43%,#d4dbee 48%,#e6eaf6);border:4px solid transparent;border-radius:5px;box-shadow:inset 1px 0 rgba(0,0,0,0.15),inset -1px 0 #fff;font-family:Segoe UI,sans-serif;font-size:11px;display:inline-block;list-style-type:none;margin:0;max-width:none;min-width:none;position:absolute}.context-menu-item{border:1px solid transparent;background-color:linear-gradient(#fff 20%,#f1f4fa 25%,#f1f4fa 43%,#d4dbee 48%,#e6eaf6);color:#000;padding:5px 22px;position:relative;user-select:none}.context-menu-item:hover{border-radius:3px;backdrop-filter:blur(7px) brightness(1.25);opacity:87%;border:1px solid rgba(0,0,0,0.4);background:linear-gradient(180deg,hsla(0,0%,100%,0.5),rgba(184,214,251,0.5) 60%,rgba(184,214,251,0.5) 90%,hsla(0,0%,100%,0.8));border-color:#b8d6fb}.context-menu-separator{background:linear-gradient(#fff 20%,#f1f4fa 25%,#f1f4fa 43%,#d4dbee 48%,#e6eaf6);border-bottom:1px solid #aca899;margin:1px 2.5px;padding:0}.context-menu-item > label > input,.context-menu-item > label > textarea{user-select:text}.context-menu-item.context-menu-hover{background-color:#8931c4;color:#fff;cursor:pointer}.context-menu-item.context-menu-disabled{background-color:#fff;color:#8c8c8c;cursor:default}.context-menu-input.context-menu-hover{background-color:#eee;cursor:default}.context-menu-submenu:after{content:"";border-style:solid;border-width:.25em 0 .25em .25em;border-color:transparent transparent transparent #000;height:0;position:absolute;right:.5em;top:50%;transform:translateY(-50%);width:0;z-index:1}.context-menu-item.context-menu-input{padding:.3em .6em}.context-menu-input > label > *{vertical-align:top}.context-menu-input > label > input[type="checkbox"],.context-menu-input > label > input[type="radio"]{margin-right:.4em;position:relative;top:.12em}.context-menu-input > label{margin:0}.context-menu-input > label,.context-menu-input > label > input[type="text"],.context-menu-input > label > textarea,.context-menu-input > label > select{box-sizing:border-box;display:block;width:100%}.context-menu-input > label > textarea{height:7em}.context-menu-item > .context-menu-list{display:none;border:1.5px solid #888;border-radius:3px;right:-.3em;top:.3em}.context-menu-item.context-menu-visible > .context-menu-list{display:block}.context-menu-accesskey{text-decoration:underline}select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMSA2SDR2MWgxdjFoMXYxaDF2MWgxVjloMVY4aDFWN2gxVjZaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(180deg,#eee 45%,#ddd 0,#bbb);background-position:100%;background-repeat:no-repeat;border:1.5px solid #888;border-radius:3px;box-shadow:inset 0 -1px 1px hsla(0,0%,100%,0.8),inset 0 1px 1px #fff;box-sizing:border-box;font:9pt Segoe UI,sans-serif;padding:2px 30px 2px 3px;position:relative}select:hover{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMSA2SDR2MWgxdjFoMXYxaDF2MWgxVjloMVY4aDFWN2gxVjZaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(180deg,#e5f4fd 45%,#b3e0f9 0);border-color:#72a2c5}select:focus{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FhYTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMSA2SDR2MWgxdjFoMXYxaDF2MWgxVjloMVY4aDFWN2gxVjZaIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+),linear-gradient(180deg,#cee9f8 45%,#86c6e8 0);border-color:#6d91ab;box-shadow:unset;outline:none}.xp_bubble,.bubble{background:linear-gradient(180deg,#fff,#ddd);color:#000;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;box-shadow:5px 5px 3px -3px rgba(0,0,0,0.4);border:1px solid rgba(0,0,0,0.4)}#skid_cont,#ban_cont,#kick_cont,.message_cont,#aboutme_cont,#unsupp_cont,#error_cont,#b_alert,.xp_dialog{background:rgba(#fff,#fff,#fff,0.9);-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#d6e6ff;opacity:97%;backdrop-filter:blur(6px) brightness(1.25)}.xp_dialog,.message_cont,.message_cont_pinball,.message_cont_solitaire{border:1px solid rgba(0,0,0,0.725);outline:5px;background:rgba(#fff,#fff,#fff,0.9);background-color:rgba(#fff,#fff,#fff,0.9);-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#d6e6ff;opacity:97%;backdrop-filter:blur(6px) brightness(1.25);box-shadow:0 0 0 1px rgba(255,255,255,0.5) inset,0 0 10px rgba(0,0,0,0.75);background-blend-mode:overlay;background-attachment:fixed;background-repeat:no-repeat;transform:translateZ(0x);background-size:100vw 100vh;transition:background-color 125ms ease-in-out;will-change:backdrop-filter,background-color}#page_warning_login,#page_reboot,#page_error,#page_ban,#page_skiddie,#page_unsupp,#page_aboutme,#page_pinball,#page_solitaire,.message_cont{background-color:rgba(0,0,0,0.5)}') } }
            }
	}),
	$("#dm_input").keypress(n => {
		if (n.which == 13) dm_send()
	})
}
function dm_send() {
	if (!$("#dm_input").val()) {
		$("#page_dm").hide()
		return
	}
	socket.emit("command", {
		list: ["dm2", {
			target: $("#dm_guid").val(),
			text: $("#dm_input").val()
		}]
	})
	$("#dm_input").val("")
	$("#page_dm").hide()
	$("#chat_message").focus()
}
document.addEventListener("touchstart", function (e) {
	e.preventDefault()
})
$(document).mouseup(function() {
    // play click sound
    var click_sfx = new Audio("./sfx/click.mp3");
	try {
		$(this).after(click_sfx.play());
	} catch(e) {}
});

// Anony Media Player
(function() {
    var $panel = $("#page_mediaplayer");
    var $video = $("#anony_video")[0];
    var looping = false;

    // Toggle panel
    $("#mediaplayer_icon").on("click", function() {
        $panel.toggle();
    });

    // Close button
    $("#mediaplayer_close").on("click", function() {
        $panel.hide();
    });

    // Drag titlebar
    (function() {
        var dragging = false, ox, oy, startRight, startBottom;
        $("#mediaplayer_titlebar").on("mousedown", function(e) {
            dragging = true;
            ox = e.clientX; oy = e.clientY;
            var rect = $panel[0].getBoundingClientRect();
            startRight = window.innerWidth - rect.right;
            startBottom = window.innerHeight - rect.bottom;
            e.preventDefault();
        });
        $(document).on("mousemove", function(e) {
            if (!dragging) return;
            var dx = ox - e.clientX, dy = oy - e.clientY;
            $panel.css({ right: Math.max(0, startRight + dx), bottom: Math.max(0, startBottom + dy), left: "auto", top: "auto" });
        }).on("mouseup", function() { dragging = false; });
    })();

    // File upload
    $("#mediaplayer_file").on("change", function() {
        var file = this.files[0];
        if (!file) return;
        var url = URL.createObjectURL(file);
        $video.src = url;
        $video.play();
        $("#mediaplayer_nowplaying").text("▶ " + file.name);
    });

    // URL row toggle
    var urlRowVisible = false;
    $("#mediaplayer_url_btn").on("click", function() {
        urlRowVisible = !urlRowVisible;
        $("#mediaplayer_url_row").toggle(urlRowVisible);
    });

    // Load URL
    $("#mediaplayer_url_load").on("click", function() {
        var url = $("#mediaplayer_url_input").val().trim();
        if (!url) return;
        $video.src = url;
        $video.play();
        $("#mediaplayer_nowplaying").text("▶ " + url);
    });
    $("#mediaplayer_url_input").on("keypress", function(e) {
        if (e.which === 13) $("#mediaplayer_url_load").click();
    });

    // Loop toggle
    $("#mediaplayer_loop_btn").on("click", function() {
        looping = !looping;
        $video.loop = looping;
        $(this).text("🔁 Loop: " + (looping ? "On" : "Off"));
    });
})();

// chat logger handler (ported to bwe)
let maximized = 0;
$(document).ready(function () {
    $("#chat_log_controls").on("click", function () {
        maximized = maximized ? 0 : 1;
        $(".chat-log").toggleClass("minimized maximized");
		if(maximized != 1) {
			$("#room_info").addClass("log-minimized");$("#arcade_icon").addClass("log-minimized");$("#themes_icon").addClass("log-minimized");$("#mediaplayer_icon").addClass("log-minimized");$("#room_info").removeClass("log-maximized");$("#arcade_icon").removeClass("log-maximized");$("#themes_icon").removeClass("log-maximized");$("#mediaplayer_icon").removeClass("log-maximized");
		} else {
			$("#room_info").removeClass("log-minimized");$("#arcade_icon").removeClass("log-minimized");$("#themes_icon").removeClass("log-minimized");$("#mediaplayer_icon").removeClass("log-minimized");$("#room_info").addClass("log-maximized");$("#arcade_icon").addClass("log-maximized");$("#themes_icon").addClass("log-maximized");$("#mediaplayer_icon").addClass("log-maximized");
		}
		if(maximized != 1) {
			$("#chat_log_list").addClass("hidden");$("#chat_log_list").removeClass("visible");
		} else {
			$("#chat_log_list").addClass("visible");$("#chat_log_list").removeClass("hidden");
		}
    });
});

socket.on('error', (err) => {
    console.error(err);
});


function setCookie(cname, cvalue, exdays) {
  const date = new Date();
  if(exdays == undefined || "" || 0 || false) {exdays = 365}
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+date.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if (getCookie("name") != "") {$("#login_name").val(getCookie("name"))}
if (getCookie("custom_theme") != "" || "None") {theme(`#content{background-image:url("./img/desktop/logo.png"), url("${getCookie("custom_theme")}"); background-repeat: no-repeat, repeat; background-size: auto, cover;}'`)}
if (getCookie("custom_theme") == "" || "None") {theme()}


const canvas = document.getElementById('bonzi_canvas');
const gl = canvas.getContext('webgl');

const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

$("#debug-device-stats").html("<span>"+vendor+"<br>"+renderer+"<br>"+navigator.platform+"<br>"+navigator.userAgent+"<br>"+navigator.language+"<br>"+navigator.connection.effectiveType+"<br>"+"</span>");

//# sourceMappingURL=app.js.map
