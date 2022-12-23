

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


