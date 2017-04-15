(function App(){
	var ViewIsActive = false;
	var ViewMode = "";
	var LastModified = 0;
	var PendingAction = "MyGroups"; // The Action to be Performed
	var SidebarMode = "";	        // MyGroups | SearchGroups
	var ActionData = "";            // contains Metadata to be processed by controller
	var ID_OF_EVENT = 0;
	var ID_OF_DISCUSSION = 0;
	var ID_OF_GROUP = 0;
	setTimeout(function View(){
		if(ViewIsActive){
			$.post('/api/view', { groupID: ID_OF_GROUP ,control: "lastModified" }, function (data) {
				var TimeDelta = parseInt(data,10);
				if(LastModified != TimeDelta){
					LastModified = TimeDelta;
					if(ViewMode == "about"){ updateAbout(); } 
					if(ViewMode == "events"){updateEvents();} 
					if(ViewMode == "event"){ updateEventInfo(); } 
					if(ViewMode == "threads"){ updateThreads(); } 
					if(ViewMode == "thread"){ updatePosts(); } 
				}
			});	
		}
	},1500);
	setTimeout(function Controller(){
		if(PendingAction != ""){
			if(PendingAction == "LoadGroup"){ loadGroup(); }
			if(PendingAction == "MyGroups"){ loadMyGroups(); }
			if(PendingAction == "AddGroup"){ addGroup(); }
			if(PendingAction == "FindGroups"){ findGroups(); }
			if(PendingAction == "CreateGroup"){ createGroup(); }
			if(PendingAction == "MakeEvent"){ makeEvent(); }
			if(PendingAction == "MakeThread"){ makeThread(); }
			if(PendingAction == "MakePost"){ makePost(); }
			PendingAction = "";
			ActionData = "";
		}
	},200);

	// Activated on Post Submission
	// Uses ID_OF_DISCUSSION
	// Uses ID_OF_GROUP
	// ActionData contains the message to be sent as "post"
	function makePost(){
		
	}
	function makeThread(){
		
	}
	function makeEvent(){
		
	}
	function createGroup(){
		
	}
	function findGroups(){
		
	}
	function addGroup(){
		
	}
	function loadGroup(){
		
	}
	function loadMyGroups(){
		
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
})();