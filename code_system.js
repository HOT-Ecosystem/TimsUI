
const clearValueSetsDisplay = function()  {
    document.getElementById('output-valueset-url').value = ""
    document.getElementById('output-valueset-id').value = ""
    document.getElementById('output-valueset-name').value = ""
    document.getElementById('output-valueset-content').value = ""
}

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

    const requestString = theServer + "/ValueSet" + "?code=" + theCode
    var myJson=""
    var response;
    alert(requestString)
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
        alert(error + "\n That server, \"" + theServer + "\" (or the browser) isn't happy. Please try another, or ask for help.");
    }

    return myJson;
}

const  getValueSetSummaryByCode = async( theServer, theCode) => {

    clearValueSetsDisplay();
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
                text +=  resource['url']   + " "             
                //text += resource['id']     + " \n"            
                text +=  resource['name'] + "\" \n"              
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

const stringifyCompose = async(resource) => {

    const comp_inc = resource['compose']['include'];              
    var output='';
    for (idx in comp_inc) {
        system_part = comp_inc[idx]['system']
        output += "CodeSystem: " + system_part + "\n"
        concept_list = comp_inc[idx]['concept']
        for (cpt_idx in concept_list) {
            cpt = concept_list[cpt_idx]
            output +=  "  code: " + cpt['code'] + " display: \"" + cpt['display'] + "\"\n"
        }
    }
    return(output)
}

const  getValueSetByName = async( theServer, theName) => {
    clearValueSetsDisplay();

    const requestString = theServer + "/ValueSet" +  "?_content=" + theName + ""
    var myJson=""
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
            if (myJson['total'] < 1) {
                alert("ValueSet " + theName + " not found")
            } else {
                i=0
                var resource = myJson['entry'][i]['resource']
                if (resource) {
                    document.getElementById('output-valueset-url').value =  resource['url'];             
                    document.getElementById('output-valueset-id').value =   resource['id'];            
                    document.getElementById('output-valueset-name').value = "\"" + resource['name'] + "\"";              
                    compose_string = await stringifyCompose(resource);
                    document.getElementById('output-valueset-content').value =  compose_string
                }
            }
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }

    return myJson;
}
const  getValueSetById = async( theServer, theId) => {

    //const requestString = theServer + "/ValueSet" +  "?_id=\"" + theId + "\""
    const requestString = theServer + "/ValueSet" +  "?_id=" + theId
    var myJson=""
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
            if (myJson['total'] < 1) {
                alert("ValueSet with id " + theId + " not found.")
            } else {
                i=0
                var resource = myJson['entry'][i]['resource']
                if (resource) {
                    document.getElementById('output-valueset-url').value = resource['url'];             
                    document.getElementById('output-valueset-id').value =  resource['id'];            
                    document.getElementById('output-valueset-name').value = "\"" + resource['name'] + "\"";              
                    compose_string = await stringifyCompose(resource);
                    document.getElementById('output-valueset-content').value = compose_string
                }
            }
        }
    }
    catch (error)  {
        alert(error + "\n That server, \"" + theServer + "\" isn't happy. Please try another, or ask for help.");
    }

    return myJson;
}

const  getCodeSystemByName = async( theServer, theName) => {

    const base_str = theServer + "/CodeSystem/" 
    const name_str = "?_name=" + theName
    const requestString = base_str +  name_str
    var myJson=""
    var text = ''
    var response;
    try {
        alert("getCodeSystemByName: " + requestString)
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
            //if (resource) {
            alert(JSON.stringify(resource))
            if (0) {
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
 /**

{
    "resourceType":"Bundle",
    "id":"8ab72554-7356-4787-aa8e-b3f45e38a207",
    "meta":{"lastUpdated":"2022-12-26T15:08:37.958-07:00"},
    "type":"searchset",
    "link":[
        {"relation":"self","url":"http://127.0.0.1:8001/fhir/CodeSystem/?_name=CodeSystem-KaryotypicSex"},
        {"relation":"next","url":"http://127.0.0.1:8001/fhir?_getpages=8ab72554-7356-4787-aa8e-b3f45e38a207&_getpagesoffset=20&_count=20&_pretty=true&_bundletype=searchset"}],
    "entry":[
        {
            "fullUrl":"http://127.0.0.1:8001/fhir/CodeSystem/ADAAreaOralCavitySystem",
            "resource":{
                "resourceType":"CodeSystem",
                "id":"ADAAreaOralCavitySystem",
                "meta":{"versionId":"1","lastUpdated":"2022-11-21T16:18:20.284-07:00"},
                "text":{"status":"generated","div":"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p>This code system <code>http://terminology.hl7.org/CodeSystem/ADAAreaOralCavitySystem</code> defines many codes, but they are not represented here</p></div>"},
                "url":"http://terminology.hl7.org/CodeSystem/ADAAreaOralCavitySystem",
                "version":"1.0.0",
                "name":"ADAAreaOralCavitySystem",
                "title":"American Dental Association Area of Oral Cavity System",
                "status":"active",
                "experimental":false,
                "date":"2022-04-07T00:00:00-00:00",
                "publisher":"American Dental Association",
                "contact":[{"name":"American Dental Association; 211 East Chicago Avenue Chicago, IL 60610-2678"}],
                "description":"The Area of Oral Cavity System is accepted and approved by the ADA and is the most commonly used system used by dental professionals in America.\r\n\r\nArea of the oral cavity is designated by a two-digit code.\r\n\r\nThe Area of Oral Cavity Syst

**/


parse_valuesets= function(json) {
    string_rep = "" 
    for (obj in json.entry) {
        thing = json.entry[obj]
        string_rep +=  
          "URL: " + thing.resource.url + "   " +
          "NAME: \"" + thing.resource.name + "\"<br>" 
    }
    return(string_rep)
}


query_capabilities = async(theServer) =>  {
    const request_string = theServer + "/metadata" 
    myJson = await do_fetch(request_string)
    valueset_text = await loop_over_pages(myJson, parse_valuesets)
    var newWin = window.open()
    newWin.document.write(valueset_text);
    newWin.document.close()
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
    //alert(JSON.stringify(myJson))
    codesystem_text = await loop_over_pages(myJson, parse_valuesets)
    var newWin = window.open()
    newWin.document.write(JSON.stringify(myJson));
    newWin.document.close()
}


