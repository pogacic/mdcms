package main

import (
	"log"
	"net/http"
	"regexp"

	dirhandler "muxgo/dir_handler"
	util "muxgo/util"
)

type ReqHandler struct{}

var MDCMS_CONTENT = util.GetEnv("MDCMS_CONTENT_FOLDER", "/mdcms_content")
var CORS_ORIGIN = util.GetEnv("CORS_ORIGIN", "*")
var MUX_PORT = util.GetEnv("SERVER_PORT", "8090")

func fileServCORS(fs http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", CORS_ORIGIN)
		fs.ServeHTTP(w, r)
	}
}

func (h *ReqHandler) RHandler(w http.ResponseWriter, r *http.Request) {}

func main() {
	log.Println("Starting mdcms backend...")
	log.Println("[HTTP] Starting mux...")

	mux := http.NewServeMux()
	mux.Handle("/get-paths", &ReqHandler{})

	fs := http.FileServer(http.Dir(MDCMS_CONTENT))
	mux.Handle("/public/", http.StripPrefix("/public/", fileServCORS(fs)))

	log.Println("[HTTP] Mux started @ http://localhost:" + MUX_PORT)
	http.ListenAndServe(":"+MUX_PORT, mux)
}

var (
	RegRouteGetPaths = regexp.MustCompile(`^/get-paths/*$`)
)

func (h *ReqHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.Method == http.MethodGet && RegRouteGetPaths.MatchString(r.URL.Path):
		w.Header().Add("Access-Control-Allow-Origin", CORS_ORIGIN)
		h.ServeGetPaths(w, r)
		return
	}
}

func (h *ReqHandler) ServeGetPaths(w http.ResponseWriter, r *http.Request) {
	f, err := dirhandler.GetFlattenedDir(MDCMS_CONTENT)

	if err != nil {
		panic("JSON marshall explosion")
	}

	w.Write(f)
}
