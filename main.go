package main
import (
	"fmt"
	"net/http"
	"github.com/julienschmidt/httprouter"
)

func init() {
	router := httprouter.New()
	router.GET("/", func(res http.ResponseWriter, req *http.Request, p httprouter.Params){
		fmt.Fprint(res,"HELLO WORLD")
	})
	http.Handle("/", router)
}