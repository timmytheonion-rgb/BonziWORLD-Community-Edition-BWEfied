function ban() {
	var reasonEl = document.getElementById("banmenu_reason");
	var targetEl = document.getElementById("banmenu_ip");
	var endEl = document.getElementById("banmenu_end");

	var reason = reasonEl ? reasonEl.value.trim() : "";
	var target = targetEl ? targetEl.value.trim() : "";
	var end = endEl ? endEl.value.trim() : "";

	if (!target) {
		alert("Please enter a target (name or IP) to ban.");
		return;
	}

	// If no end/duration is provided, default to 1 day from now.
	if (!end) {
		end = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
	}

	// Emit ban command as: ["ban", target, reason, end]
	socket.emit("command", { list: ["ban", target, reason || "", end] });

	var menu = document.getElementById("page_banmenu");
	if (menu) menu.style.display = (menu.style.display === "none") ? "block" : "none";

	alert("Ban command sent (duration: 1 day).");
}

function report() {
	var reasonEl = document.getElementById("reportmenu_reason");
	var nameEl = document.getElementById("reportmenu_name");

	var reason = reasonEl ? reasonEl.value.trim() : "";
	var name = nameEl ? nameEl.value.trim() : "";

	if (!name) {
		alert("Please enter a name to report.");
		return;
	}

	socket.emit("command", { list: ["report", name, reason || ""] });

	var menu = document.getElementById("page_reportmenu");
	if (menu) menu.style.display = (menu.style.display === "none") ? "block" : "none";

	alert("Report sent.");
}

function banmenu() {
	var x4 = document.getElementById("page_banmenu");
	if (!x4) return;
	if (x4.style.display === "none") {
		x4.style.display = "block";
	} else {
		x4.style.display = "none";
	}
}
function reportmenu() {
	var x4 = document.getElementById("page_reportmenu");
	if (!x4) return;
	if (x4.style.display === "none") {
		x4.style.display = "block";
	} else {
		x4.style.display = "none";
	}
}
