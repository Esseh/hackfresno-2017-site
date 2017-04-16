var ViewIsActive = false;
var ViewMode = "";
var LastModified = 0;
var PendingAction = "MyGroups"; // The Action to be Performed
var SidebarMode = "";	        // MyGroups | SearchGroups
var ActionData = "";            // contains Metadata to be processed by controller
var ID_OF_EVENT = 0;
var ID_OF_DISCUSSION = 0;
var ID_OF_GROUP = 0;

setInterval(function View(){
	if(ViewIsActive){
		$.post('/api/view', { groupID: ID_OF_GROUP ,control: "lastModified" }, function (data) {
			var TimeDelta = parseInt(data,10);
			if(LastModified != TimeDelta){
				console.log(`ViewMode = `,ViewMode);
				LastModified = TimeDelta;
				if(ViewMode == "about"){ updateDiscussion(); } 
				if(ViewMode == "about"){ updateAbout(); } 
				if(ViewMode == "events"){updateEvents();} 
				if(ViewMode == "event"){ updateEventInfo(); } 
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
	$.post('/api/controller', { groupID: ID_OF_GROUP, control: "makeDiscussionPost", post: action });		
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
		var arr = JSON.parse(data);
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
		var arr = JSON.parse(data);
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
	
}
function updateAbout(){
	
}
function updateEvents(){
	
}
function updateEventInfo(){
	
}
function updateThreads(){
	
}
function updatePosts(){
	
}
function newGroupPrompt(){
	ActionData = prompt("What will your group be named?");
	ActionData += "," + prompt("Which univeristy?");
	ActionData += "," + prompt("Which field of study?");
	ActionData += "," + prompt("Which subject?");
	ActionData += "," + prompt("Anything else about the group?");
	PendingAction = "CreateGroup";
}

function searchTrigger(e){
	if(e.keyCode == 13){
		ActionData = document.getElementById("sideBarSearch").value
		document.getElementById("sideBarSearch").value = "";
		PendingAction = "FindGroups";	
	}
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