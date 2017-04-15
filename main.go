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
	http.Handle("/", router)
}
