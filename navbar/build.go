package main

import (
	"encoding/json"
	"flag"
	"html/template"
	"io/ioutil"
	"os"
)

func main() {
	brandPath := *flag.String("brand", "brand.json", "Brand file for the whole organisation")
	contextPath := *flag.String("context", "codeberg-repositories.json", "Context file for the current service")
	templatePath := *flag.String("template", "template.tmpl", "Template file to use for the build")

	brandSource, err := ioutil.ReadFile(brandPath)
	throw(err)
	brandDefinition := map[string]interface{}{}
	throw(json.Unmarshal(brandSource, &brandDefinition))

	contextSource, err := ioutil.ReadFile(contextPath)
	throw(err)
	contextDefinition := map[string]interface{}{}
	throw(json.Unmarshal(contextSource, &contextDefinition))

	templateDefinition := template.New("")
	templateDefinition.Funcs(map[string]interface{}{
		"i18n": func(input interface{}) interface{} {
			if inputStr, ok := input.(string); ok {
				return inputStr
			}
			if inputMap, ok := input.(map[string]interface{}); ok {
				fallback, _ := inputMap["en"].(string)
				output := "<i18n>" + fallback
				for key, value := range inputMap {
					if key != "en" {
						output += "<template i18n-language=\"" + key + "\">" + value.(string) + "</template>"
					}
				}
				output += "</i18n>"
				return template.HTML(output)
			}
			return input
		},
		"i18nAttribute": func(attribute string, input interface{}) interface{} {
			if inputStr, ok := input.(string); ok {
				return inputStr
			}
			if inputMap, ok := input.(map[string]interface{}); ok {
				fallback, _ := inputMap["en"].(string)
				output := attribute + "=\"" + template.HTMLEscapeString(fallback) + "\""
				delete(inputMap, "en")
				data, _ := json.Marshal(inputMap)
				output += " i18n-attributes i18n-attribute-" + attribute + "=\"" + template.HTMLEscapeString(string(data)) + "\""
				return template.HTML(output)
			}
			return input
		},
	})
	templateDefinition, err = templateDefinition.ParseFiles(templatePath)
	throw(err)

	throw(templateDefinition.ExecuteTemplate(os.Stdout, templatePath, map[string]interface{}{
		"brand": brandDefinition,
		"context": contextDefinition,
	}))
}

func throw(err error) {
	if err != nil {
		panic(err)
	}
}
