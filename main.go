package main

import (
	_ "expvar"
	"flag"
	"log"
	"net/http"
	"os"
)

const (
	DefaultRoot = "www/static"
	DefaultPort = "8080"
)

func main() {
	var (
		root = flag.String("root", getDefault(DefaultRoot, "TP_ROOT"), "static file directory")
		port = flag.String("port", getDefault(DefaultPort, "TP_PORT", "PORT"), "listen port")
	)
	flag.Parse()
	log.Printf("ROOT = %q, PORT = %q\n", *root, *port)
	if *root == "" {
		log.Fatalln("No root specified")
	}
	if *port == "" {
		log.Fatalln("No port specified")
	}
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(*root))))
	log.Println("Serving files")
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

func getDefault(dflt string, envVars ...string) string {
	for _, e := range envVars {
		v, exist := os.LookupEnv(e)
		if exist {
			return v
		}
	}
	return dflt
}
