

// Utility function
// 1. Utility function to get DOM element from string
function gerElementFromString(addParamsHtml){
    let div = document.createElement('div');
    div.innerHTML = addParamsHtml;
    return div.firstElementChild;
}

// Initialize no of parameters
let addedParamCount = 2;

// Hide the parameter box initially
let parametersBox = document.getElementById('parametersBox');
parametersBox.style.display = "none";

// If the user clicks on params box, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click',()=>{
    document.getElementById('requestJsonBox').style.display = "none";
    document.getElementById('parametersBox').style.display = "block";
})


// If the user clicks on json box, hide the params box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click',()=>{
    document.getElementById('parametersBox').style.display = "none";
    document.getElementById('requestJsonBox').style.display = "block";
})

// If the user clicks on + button, add more parameters
let addParams = document.getElementById('addParams');
addParams.addEventListener('click',(e)=>{
    let params = document.getElementById('params');
    let addParamsHtml = `
    <div class="form-row my-3">
        <label for="parameterKey${addedParamCount}" class="col-sm-2 col-form-label">Parameter ${addedParamCount}</label>
        <div class="col-md-4">
            <input type="text" class="form-control" id="parameterKey${addedParamCount}" placeholder="Enter Parameter ${addedParamCount} Key">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="parameterValue${addedParamCount}"
            placeholder="Enter Parameter ${addedParamCount} Value">
        </div>
        <button class="btn btn-primary deleteParam" id="deleteParams${addedParamCount}"> - </button>
    </div>
    `;

    // Convert the element string to DOM node
    let paramElement = gerElementFromString(addParamsHtml);
    params.appendChild(paramElement);


    //Add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (const item of deleteParam) {
        item.addEventListener('click',(e)=>{
            e.target.parentElement.remove();
        })
    }

    addedParamCount++;
    e.preventDefault();
})

// If the user clicks on submit button
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click',(e)=>{
    //show please wait in the response box to request patience from the user
    // document.getElementById('responseJsonText').value = "Please wait... Fetching response..."
    document.getElementById('responsePrism').innerHTML = "Please wait... Fetching response..."

    // Fetch all the values user has entered
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    // Log all the values in the console for debugging
    
    // If user has used params option insted of json, collect all the parameters in an object
    data = {};
    if(contentType == 'params'){
        for(let i=1; i<addedParamCount;i++){
            if(document.getElementById('parameterKey'+(i)) != undefined){
                let key = document.getElementById('parameterKey'+(i)).value;
                let value = document.getElementById('parameterValue'+(i)).value;
                data[key]=value;
                // console.log(data);
            }
            data = JSON.stringify(data);
        }
    }else{
        data = document.getElementById('requestJsonText').value;
    }
    // console.log(url,requestType,contentType,data);

    // if the request type is post, invoke fetch api to create a post request
    if(requestType == 'GET'){
        fetch(url,{
            method: 'GET'
        }).then(response => response.text()).then((text)=>{
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }else{
        fetch(url,{
            method: 'POST',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(response => response.text()).then((text)=>{
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }
    e.preventDefault();
})