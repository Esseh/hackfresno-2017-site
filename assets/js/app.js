var ViewIsActive = false;
var ViewMode = "";
var LastModified = 0;
var PendingAction = "MyGroups"; // The Action to be Performed
var SidebarMode = "";	        // MyGroups | SearchGroups
var ActionData = "";            // contains Metadata to be processed by controller
var ID_OF_DISCUSSION = 0;
var ID_OF_GROUP = 0;
var fadeSpeed = 200;

setInterval(function View(){
	if(ViewIsActive){
		$.post('/api/view', { groupID: ID_OF_GROUP ,control: "lastModified" }, function (data) {
			var TimeDelta = parseInt(data,10);
			if(LastModified != TimeDelta){
				console.log(`ViewMode = `,ViewMode);
				LastModified = TimeDelta;
				if(ViewMode == "about"){ updateAbout(); }
				if(ViewMode == "events"){updateEvents();}
				if(ViewMode == "threads"){ updateThreads(); }
				if(ViewMode == "thread"){ updatePosts(); }
				if(ViewMode == "discussion"){ updateDiscussion(); }
			}
		});
	}
},1500);

setInterval(function Controller(){
	if(PendingAction != ""){
		console.log(`PendingAction = `,PendingAction);
		if(PendingAction == "LoadGroup"){ loadGroup(); }
		if(PendingAction == "MyGroups"){ loadMyGroups(); }
		if(PendingAction == "AddGroup"){ addGroup(); }
		if(PendingAction == "FindGroups"){ findGroups(); }
		if(PendingAction == "CreateGroup"){ createGroup(); }
		if(PendingAction == "MakeEvent"){ makeEvent(); }
		if(PendingAction == "MakeThread"){ makeThread(); }
		if(PendingAction == "MakePost"){ makePost(); }
		if(PendingAction == "MakeDiscussionPost"){ makeDiscussionPost(); }
		PendingAction = "";
	}
},200);

// CONTROLLER Functions

// Occurs After Submitting in Discussion(thread case)
function makePost(){
	var action = ActionData;
	ActionData = "";
	$.post('/api/controller', { groupID: ID_OF_GROUP, control: "makePost", post: action });
}

// Occurs after submitting in discussion(discussion case)
function makeDiscussionPost(){
	var action = ActionData;
	ActionData = "";
	$.post('/api/controller', { groupID: ID_OF_GROUP, control: "makeDiscussionPost", post: action, discussionID: ID_OF_GROUP });
}

// Occurs After Making New Thread in Threads
function makeThread(){
	var action = ActionData;
	ActionData = "";
	$.post('/api/controller', { groupID: ID_OF_GROUP, control: "makeThread", threadTitle: action });
}

// Occurs After Making New Event in Events
function makeEvent(){
	// ActionData is comma delimited
	var val = ActionData.split(",");
	console.log(val)
	ActionData = "";
	$.post('/api/controller', { groupID: ID_OF_GROUP, control: "makeEvent", title: val[0], what: val[1], when: val[2], where: val[3] });
}

// Occurs After Completing Create Group
function createGroup(){
	// ActionData is comma delimited
	var val = ActionData.split(",");
	ActionData = "";
	$.post('/api/creategroup', { title: val[0], university: val[1], field: val[2], subject: val[3], about: val[4] },function(){
		PendingAction = "MyGroups";
	});
}

// Occurs After Submitting(comma delimited) Search
function findGroups(){
	// ActionData is comma delimited
	var val = ActionData.split(",");
	ActionData = "";
	$.post('/api/findgroups', { university: val[0], field: val[1], subject: val[2]},function(data){
		var arr = JSON.parse(escape(data));
		var responseHTML = "";
		for(var i = 0; i < arr.length; i++){
			responseHTML += '<li onclick="addGroupTrigger(event)" id="id'+arr[i].id+'"><a href="#">'+arr[i].title+'</a></li>';
		}
		document.getElementById("innerSidebar").innerHTML = responseHTML;
		SidebarMode = "SearchGroups";
	});
}

// Occurs After clicking group in SearchGroups mode
function addGroup(){
	var action = ActionData;
	ActionData = "";
	$.post('/api/addgroup', { id: action },function(){
		PendingAction = "MyGroups";
	});
}

// Occurs After clicking group in MyGroups mode
function loadGroup(){
	document.getElementById("tabs").style.display = "initial";
	document.getElementById("messager").style.display = "initial";
	document.getElementById("wrapper").style.display = "initial";
	var action = ActionData;
	ActionData = "";
	LastModified = 0;
	ViewIsActive = true;
	ID_OF_GROUP = parseInt(action,10);
	ViewMode = "discussion";
}

// Occurs after start of program and after addGroup/createGroup
function loadMyGroups(){
	$.post('/api/mygroups',{},function(data){
		var arr = JSON.parse(escape(data));
		var responseHTML = "";
		for(var i = 0; i < arr.length; i++){
			responseHTML += '<li onclick="loadGroupTrigger(event)" id="id'+arr[i].id+'"><a href="#">'+arr[i].title+'</a></li>';
		}
		document.getElementById("innerSidebar").innerHTML = responseHTML;
		SidebarMode = "MyGroups";
	});
}

// VIEW Functions
function updateDiscussion(){
	$.post("/api/view",{groupID:ID_OF_GROUP,control:"discussionPosts"},function(data){
		console.log(data);
		var arr = JSON.parse(escape(data));
		var responseHTML = "";
		responseHTML += '<li>'
		responseHTML += '<span class="username">Bot: </span>'
		responseHTML += '<span class="usermessage">Welcome to Open Discussion!</span>'
		responseHTML += '</li>'
		var currUser = "";
		for(var i = 0; i < arr.length; i++){
			if(arr[i].poster != currUser){
				if(i != 0){ responseHTML += '</li>'; }
				responseHTML += '<li>'
				responseHTML += '<span class="username">'+arr[i].poster+'</span>';
				currUser = arr[i].poster;
			}
			responseHTML += '<span class="usermessage">'+arr[i].post+'</span>'
		}
		if(arr.length != 0){ responseHTML+='</li>';}
		document.getElementById("postList").innerHTML = responseHTML;
		window.scrollTo(0,document.body.scrollHeight);
	});
}
function updateAbout(){
	$.post("/api/view",{groupID:ID_OF_GROUP,control:"about"},function(data){
		var d = JSON.parse(data);
		document.getElementById("postList").innerHTML = '<li><span class="username">'+d.about+'</span></li>';
	});
}
function updateEvents(){
	var arr = [1];
	var waitLength = 0;
	$.post("/api/view",{groupID:ID_OF_GROUP,control:"events"},function(data){
		arr = JSON.parse(data).reverse();
	}).done(function(){
		$.each(arr,function(i,v){
			$.post("/api/view",{goupID:ID_OF_GROUP,control:"eventInfo",eventID:v.id},function(data){
				arr[i].data = JSON.parse(data);
			}).done(function(){waitLength++;});
		});
	});
	var timer = setInterval(function(){
		console.log("tick")
		if(waitLength == arr.length){
			while(waitLength != arr.length){}
			var responseHTML = "";
				responseHTML += "<li>"
				responseHTML += '<span class="username">Bot: </span>'
				responseHTML += '<span class="usermessage">Why not check out one of the cool events posted here?...</span>'
				responseHTML += "</li>"
			for(var i = 0; i < arr.length; i++){
				responseHTML += "<li>"
				responseHTML += '<span class="username">'+arr[i].title+'</span>'
				responseHTML += '<span class="usermessage">'+arr[i].data.what+'</span>'
				responseHTML += '<span class="usermessage">'+arr[i].data.when+'</span>'
				responseHTML += '<span class="usermessage">'+arr[i].data.where+'</span>'
				responseHTML += "</li>"
			}
			document.getElementById("postList").innerHTML = responseHTML;
			window.scrollTo(0,document.body.scrollHeight);
			clearInterval(timer);
		}
	},100);
}

function updateThreads(){
	$.post("/api/view",{groupID:ID_OF_GROUP, control:"threadTitles"},function(data){
		console.log(data);
		var arr = JSON.parse(data);
		var responseHTML = "";
		responseHTML += "<li>"
		responseHTML += '<span class="username">Bot: </span>'
		responseHTML += '<span class="usermessage">Click on a thread title to open it!</span>'
		responseHTML += "</li>"
		for(var i = 0; i < arr.length; i++){
			responseHTML += '<a style="z-index:999999;" href="#">';
			responseHTML += '<li onclick="openThreadTrigger(event)" id="id'+arr[i].id+'">';
			responseHTML += '<span class="username">'+arr[i].title+'</span>';
			responseHTML += '</li>';
			responseHTML += '</a>';
		}
		document.getElementById("postList").innerHTML = responseHTML;
		window.scrollTo(0,document.body.scrollHeight);
	})
}

function updatePosts(){

}

function newGroupPrompt(){
		$("#createBox").fadeToggle(fadeSpeed);
		$("#screen").fadeToggle(fadeSpeed);
}


function submitGroupPrompt(){
	if(document.getElementById("create1").value == "")
	{
		return
	}
	ActionData = document.getElementById("create1").value;
	document.getElementById("create1").value = "";
	ActionData += "," + document.getElementById("create2").value;
	document.getElementById("create2").value = "";
	ActionData += "," + document.getElementById("create3").value;
	document.getElementById("create3").value = "";
	ActionData += "," + document.getElementById("create4").value;
	document.getElementById("create4").value = "";
	ActionData += "," + document.getElementById("create5").value;
	document.getElementById("create5").value = "";
	newGroupPrompt();

	PendingAction = "CreateGroup"
}

function submitEventPrompt(){
	if(document.getElementById("eventTitle").value == "")
	{
		return
	}
	ActionData = document.getElementById("eventTitle").value;
	document.getElementById("eventTitle").value = "";
	ActionData += "," + document.getElementById("event1").value;
	document.getElementById("event1").value = "";
	ActionData += "," + document.getElementById("event2").value;
	document.getElementById("event2").value = "";
	ActionData += "," + document.getElementById("event3").value;
	document.getElementById("event3").value = "";
	PendingAction = "MakeEvent";
	$("#eventBox").fadeToggle(fadeSpeed);
	$("#screen").fadeToggle(fadeSpeed);
}

function searchTrigger(){
		if((document.getElementById("search1").value != "") || (document.getElementById("search2").value != "") || (document.getElementById("search3").value != ""))
		{
		ActionData = document.getElementById("search1").value;
		document.getElementById("search1").value = "";
		ActionData += "," + document.getElementById("search2").value;
		document.getElementById("search2").value = "";
		ActionData += "," + document.getElementById("search3").value;
		document.getElementById("search3").value = "";
		PendingAction = "FindGroups";
		searchFade();
		}
		else{ return;}
}

function submitTrigger(e){
	if(e.keyCode == 13){
		if(ViewMode == "discussion"){
			ActionData = document.getElementById("submissionArea").value;
			document.getElementById("submissionArea").value = "";
			PendingAction = "MakeDiscussionPost";
		}
		if(ViewMode == "threads"){
			ActionData = document.getElementById("submissionArea").value;
			document.getElementById("submissionArea").value = "";
			PendingAction = "MakeThread";
		}
		if(ViewMode == "thread"){
			// TODO
		}
		if(ViewMode == "events"){
			$("#eventBox").fadeToggle(fadeSpeed);
			$("#screen").fadeToggle(fadeSpeed);
			document.getElementById("eventTitle").value = document.getElementById("submissionArea").value;
			document.getElementById("submissionArea").value = "";
			//ActionData += "," + prompt("Describe The Event Taking Place...");
			//ActionData += "," + prompt("When will the event happen?");
			//ActionData += "," + prompt("Where will the event occur?");
			//PendingAction = "MakeEvent";
		}
	}
}

function eventFadeOut(){
	$("#eventBox").fadeToggle(fadeSpeed);
	$("#screen").fadeToggle(fadeSpeed);
}

function searchFade(){
	$("#searchBox").fadeToggle(fadeSpeed);
	$("#screen").fadeToggle(fadeSpeed);
}

function addGroupTrigger(e){
	ActionData = (e.target.parentNode.id)
	ActionData = ActionData.substring(2,ActionData.length);
	PendingAction = "AddGroup";
}
function loadGroupTrigger(e){
	ActionData = (e.target.parentNode.id)
	ActionData = ActionData.substring(2,ActionData.length);
	PendingAction = "LoadGroup";
}

function openDiscussionTrigger(){
	ViewMode = "discussion";
	LastModified = 0;
}
function threadsTrigger(){
	ViewMode = "threads";
	LastModified = 0;
}
function eventsTrigger(){
	ViewMode = "events";
	LastModified = 0;
}
function infoTrigger(){
	ViewMode = "about";
	LastModified = 0;
}

function openThreadTrigger(e){
	alert(e.target.parentNode.id);
	//ViewMode = "thread";
	//ID_OF_DISCUSSION = ;
	//LastModified = 0;
}

function escape(str) { return str; }
