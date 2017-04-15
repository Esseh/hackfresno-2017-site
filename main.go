package main
import (
	"fmt"
	"net/http"
	"html/template"
	"github.com/julienschmidt/httprouter"
)
var TPL *template.Template
func init() {
	funcMap := template.FuncMap{}
	TPL = template.New("").Funcs(funcMap)
	TPL = template.Must(TPL.ParseGlob("templates/*"))
}

func init() {
	router := httprouter.New()
	router.GET("/", func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		fmt.Fprint(res,"HELLO WORLD")
	})
	http.Handle("/", router)
}