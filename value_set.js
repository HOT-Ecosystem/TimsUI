

do_fetch = async(url) => {
    try {
        const response = await fetch(url, myHeaders)
        if (!response.ok) {
            alert("ERROR status:" + response.status + 
               ", text: \"" + response.statusText + "\"" +
               "\n\nCheck the code and selected vocabulary.  Most likely the code \"" + theCode + 
               "\"  wasn't found in the vocabulary \"" + theSystem + "\".");
        } else {
            const myJson = await response.json();
            return(myJson);
        }
    }
    catch (error)  {
        alert("ERROR paging:" + error)
    }
    return("error");
}


find_parameter_by_name = function(params, name) {
    for (p in params) {
        if (params[p].name == name) {
            return(params[p].valueString);
        }
    }
    return("(not found)");
}

// Like find_parameter_by_name (above), but looks through all the things with that parameter and looks for a specific value
find_obj_by_attr_val = function(obj_array, attr_name, value) {
    for (i in obj_array) {
        obj = obj_array[i]
        if (obj[attr_name] == value) {
            return obj;
        }
    } 

    return null;
}
    // not this? FIX TODO
    //possible_link = bundle['link'].find((obj) => obj['relation'] == 'next') 


get_next_link = function(bundle) {
    possible_link = find_obj_by_attr_val(bundle['link'], 'relation', 'next') 
    if (possible_link) {
        return possible_link['url'];
    }
    return null;
}

loop_over_pages = async(bundle, fn) => {
    var valueset_text=''
    valueset_text += fn(bundle);
    next_link = get_next_link(bundle);
    var i=1
    while (next_link) { //  && i < 5) {
        bundle = await do_fetch(next_link);
        if (bundle) {
            valueset_text += fn(bundle);
            next_link = await get_next_link(bundle);
            i += 1
        }
        else {
            alert("didn't get on from do_fetch");
            next_link = null;
        }
    }
    return(valueset_text)
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
                text += "URL:  " + resource['url']   + ""             
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
/***

{   
    "resourceType":"Bundle",
    "id":"d515cc74-9051-4073-87d1-0a3d0569f2f0",
    "meta":{"lastUpdated":"2022-12-26T09:45:11.575-07:00"},
    "type":"searchset",
    "total":1,
    "link":[{"relation":"self","url":"http://127.0.0.1:8001/fhir/ValueSet/?name=KaryotypicSex"}],
    "entry":[
        {"fullUrl":"http://127.0.0.1:8001/fhir/ValueSet/KaryotypicSex",
         "resource":{
            "resourceType":"ValueSet",
            "id":"KaryotypicSex",
            "meta":{"versionId":"1","lastUpdated":"2022-11-21T17:07:55.472-07:00"},
            "text":{"status":"generated","div":"<div xmlns=\"http://www.w3.org/1999/xhtml\"><ul><li>Include all codes defined in <a href=\"CodeSystem-KaryotypicSex.html\"><code>https://github.com/phenopackets/core-ig/CodeSystem/KaryotypicSex</code></a></li></ul></div>"},
            "url":"https://github.com/phenopackets/core-ig/ValueSet/KaryotypicSex",
            "version":"0.1.0",
            "name":"KaryotypicSex",
            "title":"Karyotypic sex value set",
            "status":"active",
            "date":"2021-05-28T17:06:00-04:00",
            "publisher":"Global Alliance for Genomics and Health - Clinical and Phenotypic Data Capture Work Stream",
            "contact":[{"name":"Global Alliance for Genomics and Health - Clinical and Phenotypic Data Capture Work Stream",
                        "telecom":[{"system":"url","value":"https://www.ga4gh.org/work_stream/clinical-phenotypic-data-capture-2/"}]}],
            "description":"The karyotypic (chromosomal) sex of an individual",
            "jurisdiction":[{"coding":[{"system":"urn:iso:std:iso:3166","code":"US"}]}],
            "copyright":"[Global Alliance for Genomics and Health](https://www.ga4gh.org)",
            "compose":{"include":[{"system":"https://github.com/phenopackets/core-ig/CodeSystem/KaryotypicSex"}]}},
            "search":{"mode":"match"}
        }
      ]
}
***/
const  getValueSetByName = async( theServer, theName) => {

    const base_str = theServer + "/ValueSet/" 
    const name_str = "?name=" + theName
    const requestString = base_str +  name_str
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
            i=0
            var resource = myJson['entry'][i]['resource']
            if (resource) {
                document.getElementById('output-valueset-url').value = "URL:  " + resource['url'];             
                document.getElementById('output-valueset-id').value =  "id:   " + resource['id'];            
                document.getElementById('output-valueset-name').value = "NAME: " + resource['name'];              
            }
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


query_loaded_valuesets = async(theServer) =>  {
    const request_string = theServer + "/ValueSet?_summary=true" 
    myJson = await do_fetch(request_string)
    valueset_text = await loop_over_pages(myJson, parse_valuesets)
    var newWin = window.open()
    newWin.document.write(valueset_text);
    newWin.document.close()
}

query_loaded_valuesets_by_system = async(theServer, theSystem) => {
    const request_string = theServer + "/ValueSet?_system=" + theSystem
    myJson = await do_fetch(request_string)
    valueset_text = await loop_over_pages(myJson, parse_valuesets)
    var newWin = window.open()
    newWin.document.write(valueset_text);
    newWin.document.close()

}

query_loaded_codesystems = async(theServer) => {
    const request_string = theServer + "/CodeSystem?_summary=true" 
    myJson = await do_fetch(request_string)
    valueset_text = await loop_over_pages(myJson, parse_valuesets)
    var newWin = window.open()
    newWin.document.write(valueset_text);
    newWin.document.close()
}


