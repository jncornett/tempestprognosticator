package main

import (
	_ "expvar"
	"flag"
	"log"
	"net/http"
	"os"
)

const (
	DefaultRoot          = "www/static"
	DefaultPort          = "8080"
	DefaultWordnikAPIKey = ""
	WordnikURL           = "http://api.wordnik.com/v4"
)

func main() {
	var (
		root          = flag.String("root", getDefault(DefaultRoot, "TP_ROOT"), "static file directory")
		port          = flag.String("port", getDefault(DefaultPort, "TP_PORT", "PORT"), "listen port")
		wordnikAPIKey = flag.String("wordnik", getDefault(DefaultWordnikAPIKey, "TP_WORDNIK_API_KEY"), "Wordnik API Key")
	)
	flag.Parse()
	log.Printf("ROOT = %q, PORT = %q\n", *root, *port)
	if *root == "" {
		log.Fatalln("No root specified")
	}
	if *port == "" {
		log.Fatalln("No port specified")
	}
	if *wordnikAPIKey == "" {
		log.Fatalln("No Wordnik API key specified")
	}
	wordnikService := NewWordnikService(WordnikURL, *wordnikAPIKey)
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(*root))))
	http.Handle("/wordnik/", http.StripPrefix("/wordnik/", wordnikService))
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
