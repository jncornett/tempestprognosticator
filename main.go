package main

import (
	"encoding/json"
	_ "expvar"
	"flag"
	"log"
	"net/http"
	"os"
	"sync"
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
	http.HandleFunc("/wordnikPreload", func(w http.ResponseWriter, r *http.Request) {
		var words []string
		if err := json.NewDecoder(r.Body).Decode(&words); err != nil {
			log.Println("/wordnikPreload", "Could not decode words array:", err)
			http.Error(w, "BAD REQUEST", http.StatusBadRequest)
			return
		}
		var (
			mux     sync.Mutex
			entries []Entry
		)
		sem := make(chan interface{}, len(words))
		for _, word := range words {
			word := word
			go func() {
				entry, err := wordnikService.Lookup(word)
				if err != nil {
					log.Printf("Lookup %q error: %v\n", word, err)
				} else if entry == nil {
					log.Printf("Lookup %q returned nil", word)
				} else {
					mux.Lock()
					entries = append(entries, *entry)
					mux.Unlock()
				}
				sem <- nil
			}()
		}
		for i := 0; i < len(words); i++ {
			<-sem // Wait for all words to return
		}
		if err := json.NewEncoder(w).Encode(entries); err != nil {
			http.Error(w, "", http.StatusInternalServerError)
		}
	})
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
