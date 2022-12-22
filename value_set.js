

find_parameter_by_name = function(params, name) {
    var label_value = '';
    for (p in params) {
        if (params[p].name == name) {
            return(params[p].valueString);
        }
    }
    return("(not found)");
}

const  getValueSetRawByCode = async( theServer, theCode) => {

    const base_str = theServer + "/ValueSet/" 
    const code_str = "?code=" + theCode
    const requestString = base_str +  code_str
    var myJson=""
    var response;
    try {
        response = await fetch(requestString, myHeaders)
        my_desig = []
        if (!response.ok) {
            alert("ERROR status:" + response.status + 
               ", text: \"" + response.statusText + "\"" +
               "\n\nCheck the code and selected vocabulary.  Most likely the code \"" + theCode + 
               "\"  wasn't found in the vocabulary \"" + theSystem + "\".");
        } else {
            myJson = await response.json();
            var newWin = window.open()
            newWin.document.write(JSON.stringify(myJson))
            newWin.document.close()
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }

    return myJson;
}

const  getValueSetSummaryByCode = async( theServer, theCode) => {

    const base_str = theServer + "/ValueSet/" 
    const code_str = "?code=" + theCode
    const requestString = base_str +  code_str
    var myJson=""
    var text = ''
    var response;
    try {
        response = await fetch(requestString, myHeaders)
        my_desig = []
        if (!response.ok) {
            alert("ERROR status:" + response.status + 
               ", text: \"" + response.statusText + "\"" +
               "\n\nCheck the code and selected vocabulary.  Most likely the code \"" + theCode + 
               "\"  wasn't found in the vocabulary \"" + theSystem + "\".");
        } else {
            myJson = await response.json();
            for (i in myJson['entry']) {
                var resource = myJson['entry'][i]['resource']
                text += "URL:  " + resource['url']   + ", "             
                //text += "id:   " + resource['id']     + " \n"            
                text += "NAME: " + resource['name'] + " \n"              
             }
             document.getElementById('output-value-set').value = text;
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }

    return myJson;
}

parse_valuesets= function(json) {
    string_rep = "" 
    
    for (obj in json.entry) {
        thing = json.entry[obj]
        
        string_rep +=  
          "URL: " + thing.resource.url + "   " +
          "NAME: " + thing.resource.name + "<br>" 
        
    }
    
    return(string_rep)
}

/**
{"fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/LL1000-0",
    "resource":{"resourceType":"ValueSet",
                "id":"LL1000-0"
                "meta":{"versionId":"1",
                        "lastUpdated":"2022-12-16T14:50:54.767-07:00",
                        "tag":[{"system":"http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                            "code":"SUBSETTED",
                            "display":"Resource encoded in summary mode"}]},
                "url":"http://loinc.org/vs/LL1000-0",
                "identifier":[{
                    "system":"urn:ietf:rfc:3986",
                    "value":"urn:oid:1.3.6.1.4.1.12009.10.1.165"}],
                "version":"Beta.1",
                "name":"PhenX05_13_30D bread amt",
                "status":"active",  
                "publisher":"Regenstrief Institute, Inc.",
                "contact":[{"name":"Regenstrief Institute, Inc.",
                            "telecom":[{"system":"url","value":"https://loinc.org"}]}]
    },
    "search":{"mode":"match"}}
{"fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/LL1001-8",

    "resource":{"resourceType":"ValueSet","id":"LL1001-8","meta":{"versionId":"1","lastUpdated":"2022-12-16T14:50:54.793-07:00","tag":[{"system":"http://terminology.hl7.org/CodeSystem/v3-ObservationValue","code":"SUBSETTED","display":"Resource encoded in summary mode"}]},"url":"http://loinc.org/vs/LL1001-8","identifier":[{"system":"urn:ietf:rfc:3986","value":"urn:oid:1.3.6.1.4.1.12009.10.1.166"}],"version":"Beta.1","name":"PhenX05_14_30D freq amts","status":"active","publisher":"Regenstrief Institute, Inc.","contact":[{"name":"Regenstrief Institute, Inc.","telecom":[{"system":"url","value":"https://loinc.org"}]}]},"search":{"mode":"match"}}{"fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/LL1002-6",
    "resource":{"resourceType":"ValueSet","id":"LL1002-6","meta":{"versionId":"1","lastUpdated":"2022-12-16T14:50:54.804-07:00","tag":[{"system":"http://terminology.hl7.org/CodeSystem/v3-ObservationValue","code":"SUBSETTED","display":"Resource encoded in summary mode"}]},"url":"http://loinc.org/vs/LL1002-6","identifier":[{"system":"urn:ietf:rfc:3986","value":"urn:oid:1.3.6.1.4.1.12009.10.1.167"}],"version":"Beta.1","name":"PhenX05_15_30D cereal amt","status":"active","publisher":"Regenstrief Institute, Inc.","contact":[{"name":"Regenstrief Institute, Inc.","telecom":[{"system":"url","value":"https://loinc.org"}]}]},"search":{"mode":"match"}}{"fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/LL1003-4",

**/

query_loaded_valuesets = async(theServer) => {
    const request_string = theServer + "/ValueSet?_summary=true" 

    try {
        const response = await fetch(request_string, myHeaders)
        if (!response.ok) {
            alert("ERROR status:" + response.status + 
               ", text: \"" + response.statusText + "\"" +
               "\n\nCheck the code and selected vocabulary.  Most likely the code \"" + theCode + 
               "\"  wasn't found in the vocabulary \"" + theSystem + "\".");
        } else {
            const myJson = await response.json();
            var newWin = window.open()
            newWin.document.write("SERVER:" + theServer + "<br>" + parse_valuesets(myJson))
            newWin.document.close()
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }
}

query_loaded_valuesets_by_system = async(theServer, theSystem) => {
    const request_string = theServer + "/ValueSet?_system=" + theSystem

    try {
        const response = await fetch(request_string, myHeaders)
        if (!response.ok) {
            alert("ERROR status:" + response.status + 
               ", text: \"" + response.statusText + "\"" +
               "\n\nCheck the code and selected vocabulary.  Most likely the code \"" + theCode + 
               "\"  wasn't found in the vocabulary \"" + theSystem + "\".");
        } else {
            const myJson = await response.json();
            var newWin = window.open()
            newWin.document.write("SERVER:" + theServer + "<br>" + "SYSTEM:" + theSystem + "<br>" + "REQUEST:" + request_string + "<br>" +  parse_valuesets(myJson))
            newWin.document.close()
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }
}


/**

{
    "resourceType":"Bundle",
    "id":"1b6c19d1-71d5-4d83-818f-58e28040b9d8",
    "meta":{"lastUpdated":"2022-12-22T14:20:37.138-07:00"},
    "type":"searchset",
    "total":1,
    "link":[{"relation":"self","url":"http://127.0.0.1:8001/fhir/ValueSet/?code=LA13838-0"}],
    "entry":[
        {
            "fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/LL1000-0",
            "resource":{
                "resourceType":"ValueSet",
                "id":"LL1000-0",
                "meta":{"versionId":"1","lastUpdated":"2022-12-16T14:50:54.767-07:00"},
                "url":"http://loinc.org/vs/LL1000-0",
                "identifier":[{"system":"urn:ietf:rfc:3986","value":"urn:oid:1.3.6.1.4.1.12009.10.1.165"}],
                "version":"Beta.1",
                "name":"PhenX05_13_30D bread amt",
                "status":"active",
                "publisher":"Regenstrief Institute, Inc.",
                "contact":[{"name":"Regenstrief Institute, Inc.","telecom":[{"system":"url","value":"https://loinc.org"}]}],
                "copyright":"This material contains content from LOINC (http://loinc.org). LOINC is copyright ©1995-2022, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc.",
                "compose":{
                    "include":[
                        {
                            "system":"http://loinc.org",
                            "concept":[
                                {"code":"LA13825-7","display":"1 slice or 1 dinner roll"},
                                {"code":"LA13838-0","display":"2 slices or 2 dinner rolls"},
                                {"code":"LA13892-7","display":"More than 2 slices or 2 dinner rolls"}]
                        }
                    ]
                }
            },
            "search":{"mode":"match"}
        }
    ]
}

**/

