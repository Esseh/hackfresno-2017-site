package main

import (
	"html/template"
	"net/http"

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
	TPL.ExecuteTemplate(res, "index", nil)
}

// Serves the index page.
func login(res http.ResponseWriter, req *http.Request, p httprouter.Params) {
	TPL.ExecuteTemplate(res, "login", nil)
}

func init() {
	router := httprouter.New()
	router.GET("/", index)
	router.GET("/login", login)
	router.GET("/login/github/oauth/send", AUTH_OAUTH_GITHUB_Send)
	router.GET("/login/github/oauth/recieve", AUTH_OAUTH_GITHUB_Recieve)
	router.GET("/login/dropbox/oauth/send", AUTH_OAUTH_DROPBOX_Send)
	router.GET("/login/dropbox/oauth/recieve", AUTH_OAUTH_DROPBOX_Recieve)
	http.Handle("/", router)
}
