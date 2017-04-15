package main

import (
	"html/template"
	"net/http"
	"github.com/Esseh/hackfresno-2017-dev/CONTEXT"
	"github.com/Esseh/hackfresno-2017-dev/CONTROLLER"
	"github.com/Esseh/hackfresno-2017-dev/VIEW"
	"github.com/Esseh/hackfresno-2017-dev/USER_API"
	"github.com/julienschmidt/httprouter"
)

var TPL *template.Template

func init() {
	funcMap := template.FuncMap{}
	TPL = template.New("").Funcs(funcMap)
	TPL = template.Must(TPL.ParseGlob("templates/*"))
}

// Serves the index page.
func index(res http.ResponseWriter, req *http.Request, p httprouter.Params) {
	_, err := req.Cookie("login")
	if err == nil {
		http.Redirect(res, req, "app", http.StatusSeeOther)
	}
	TPL.ExecuteTemplate(res, "index", nil)
}

// Serves the index page.
func login(res http.ResponseWriter, req *http.Request, p httprouter.Params) {
	_, err := req.Cookie("login")
	if err == nil {
		http.Redirect(res, req, "app", http.StatusSeeOther)
	}
	TPL.ExecuteTemplate(res, "login", nil)
}

func app(res http.ResponseWriter, req *http.Request, p httprouter.Params) {
	TPL.ExecuteTemplate(res, "app", nil)
}

func init() {
	router := httprouter.New()
	router.GET("/", index)
	router.GET("/login", login)
	router.GET("/app", app)
	router.GET("/login/github/oauth/send", AUTH_OAUTH_GITHUB_Send)
	router.GET("/login/github/oauth/recieve", AUTH_OAUTH_GITHUB_Recieve)
	router.GET("/login/dropbox/oauth/send", AUTH_OAUTH_DROPBOX_Send)
	router.GET("/login/dropbox/oauth/recieve", AUTH_OAUTH_DROPBOX_Recieve)
	router.POST("/api/controller",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		CONTROLLER.API(CONTEXT.NewContext(res,req))
	})
	router.POST("/api/view",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		VIEW.API(CONTEXT.NewContext(res,req))
	})
	router.POST("/api/creategroup",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		USER_API.CreateGroupAPI(CONTEXT.NewContext(res,req))	
	})
	router.POST("/api/findgroups",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		USER_API.FindGroupsAPI(CONTEXT.NewContext(res,req))		
	})
	router.POST("/api/mygroups",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		USER_API.MyGroupsAPI(CONTEXT.NewContext(res,req))		
	})
	router.POST("/api/addgroup",func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		USER_API.AddGroupAPI(CONTEXT.NewContext(res,req))		
	})
	http.Handle("/", router)
}
