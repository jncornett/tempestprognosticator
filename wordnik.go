package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"path"
	"strconv"
	"strings"
)

type Entry struct {
	Name       string `json:"word"`
	Definition string `json:"definition"`
	Example    string `json:"example"`
}

type WordnikService struct {
	cache    map[string]Entry
	endpoint string
	apiKey   string
}

func NewWordnikService(url, apiKey string) *WordnikService {
	return &WordnikService{
		cache:    make(map[string]Entry),
		endpoint: url,
		apiKey:   apiKey,
	}
}

func (s *WordnikService) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	word := r.URL.Path
	if entry, err := s.Lookup(word); err != nil {
		log.Println("Lookup error", err)
		http.Error(w, "ERROR", http.StatusInternalServerError)
	} else if entry == nil {
		http.Error(w, "NOT FOUND", http.StatusNotFound)
	} else {
		log.Println("(in ServeHTTP) entry", entry)
		if err := json.NewEncoder(w).Encode(entry); err != nil {
			http.Error(w, "ERROR", http.StatusInternalServerError)
		}
	}
}

func (s *WordnikService) Lookup(word string) (*Entry, error) {
	entry, ok := s.cache[word]
	if ok {
		return &entry, nil
	}
	entry.Name = word
	var err error
	lower := strings.ToLower(word)
	if entry.Definition, err = s.lookupDefinition(lower); err != nil {
		return nil, err
	}
	if entry.Example, err = s.lookupExample(lower); err != nil {
		return nil, err
	}
	if entry.Definition == "" && entry.Example == "" {
		return nil, nil
	}
	s.cache[word] = entry
	s.cache[lower] = entry
	return &entry, nil
}

type WordnikDefinition struct {
	Text string
}

func (s *WordnikService) lookupDefinition(word string) (string, error) {
	u, err := s.getPath("word.json", word, "definitions")
	if err != nil {
		return "", err
	}
	q := u.Query()
	q.Set("limit", strconv.Itoa(1))
	u.RawQuery = q.Encode()
	log.Println("LOOKUP DEFINITION", u.String())
	resp, err := http.Get(u.String())
	if err != nil {
		return "", err
	}
	if resp.StatusCode == http.StatusBadRequest || resp.StatusCode == http.StatusNotFound {
		return "", nil // Indicate not found
	}
	defer resp.Body.Close()
	var def []WordnikDefinition
	if err = json.NewDecoder(resp.Body).Decode(&def); err != nil {
		return "", err
	}
	log.Println("Definitions of", word, ":", def)
	if len(def) < 1 {
		return "", nil
	}
	return def[0].Text, nil
}

type WordnikExample struct {
	Text string
}

func (s *WordnikService) lookupExample(word string) (string, error) {
	u, err := s.getPath("word.json", word, "topExample")
	if err != nil {
		return "", err
	}
	log.Println("LOOKUP EXAMPLE", u.String())
	resp, err := http.Get(u.String())
	if err != nil {
		return "", err
	}
	if resp.StatusCode == http.StatusBadRequest || resp.StatusCode == http.StatusNotFound {
		return "", nil // Indicate not found
	}
	defer resp.Body.Close()
	var ex WordnikExample
	if err := json.NewDecoder(resp.Body).Decode(&ex); err != nil {
		return "", err
	}
	log.Println("Example for", word, ":", ex)
	return ex.Text, nil
}

func (s *WordnikService) getPath(category, word string, parts ...string) (*url.URL, error) {
	u, err := url.Parse(s.endpoint)
	if err != nil {
		return nil, err
	}
	u.Path = path.Join(append([]string{u.Path, category, word}, parts...)...)
	v := url.Values{}
	v.Set("api_key", s.apiKey)
	u.RawQuery = v.Encode()
	return u, nil
}
