package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

/* we’re going to use the popular third-party package httprouter as the
router for our application, instead of using http.ServeMux
from the standard-library. This is because for 404 and 50x
standard lib doesn't provide the JSON responses. which makes it difficult to work with. There is an  [open proposal](https://github.com/golang/go/issues/65648) to address.
this issue. But for now "github.com/julienschmidt/httprouter" is the solution we are going with
*/

func (app *application) routes() http.Handler {
	router := httprouter.New()

	// Convert the notFoundResponse() helper to a http.Handler using the
	// http.HandlerFunc() adapter, and then set it as the custom error handler for 404
	// Not Found responses.
	router.NotFound = http.HandlerFunc(app.notFoundResponse)

	// Likewise, convert the methodNotAllowedResponse() helper to a http.Handler and set
	// it as the custom error handler for 405 Method Not Allowed responses.
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc(http.MethodGet, "/v1/ws", app.websocketHandler)

	return app.recoverPanic(router)
}
