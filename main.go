package main

import (
	_ "expvar"
	"flag"
	"log"
	"net/http"
	"os"
)

const (
	DefaultStaticFilesDir = "www/static"
	DefaultListenAddress  = ":80"
)

func main() {
	var (
		staticFilesDir = flag.String("root", getDefault("TP_ROOT", DefaultStaticFilesDir), "")
		listenAddress  = flag.String("listen", getDefault("TP_LISTEN", DefaultListenAddress), "")
	)
	flag.Parse()
	// FIXME validate flags
	log.Printf("ROOT = %q, LISTEN = %q\n", *staticFilesDir, *listenAddress)
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(*staticFilesDir))))
	log.Println("Serving files")
	log.Fatal(http.ListenAndServe(*listenAddress, nil))
}

func getDefault(envVar, dflt string) string {
	v, exist := os.LookupEnv(envVar)
	if exist {
		return v
	}
	return dflt
}
