// Contains the handlers for our OAuth interactions.
package main

import (
	"net/http"

	"github.com/Esseh/goauth"
	dropbox "github.com/Esseh/goauth-dropbox"
	github "github.com/Esseh/goauth-github"
	"google.golang.org/appengine"
	"github.com/Esseh/hackfresno-2017-dev/OAUTH"
	"github.com/julienschmidt/httprouter"
)

func init() {
	goauth.GlobalSettings.ClientType = "appengine"
	github.Config.ClientID = "e0297346f88565c9f443"
	github.Config.SecretID = "7dd96d4a262a004aeffefe4b0af1a38e03b38d14"
	github.Config.Redirect = "http://localhost:8080/login/github/oauth/recieve"
	dropbox.Config.ClientID = "ddhu8e7nswl56yt"
	dropbox.Config.SecretID = "387kru0n9nb0qkk"
	dropbox.Config.Redirect = "http://localhost:8080/login/dropbox/oauth/recieve"
}

func AUTH_OAUTH_GITHUB_Send(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
	github.Send(res, req)
}

func AUTH_OAUTH_GITHUB_Recieve(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
	token := github.Recieve(res, req)
	emailObj, _ := token.Email(req)
	OAUTH.Login(appengine.NewContext(req), res, req, emailObj.Email)
}

func AUTH_OAUTH_DROPBOX_Send(res http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	dropbox.Send(res, req)
}
func AUTH_OAUTH_DROPBOX_Recieve(res http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	token := dropbox.Recieve(res, req)
	accountInfo, _ := token.AccountInfo(req)
	OAUTH.Login(appengine.NewContext(req), res, req, accountInfo.Email)
}
