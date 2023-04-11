
 async function getDoc_ID(){
    const response = await fetch('http://localhost:8000/data');
    const Doc_ID = await response.json();
    document.getElementById("activateModal").disabled = false;
    if(Doc_ID.ID == false){
        $("#cnf").html("Error Occured !");
    }
    else{
        $("#cnfHead").html("Data stored with Doc_ID :");
        $("#cnf").html(Doc_ID.ID);
    }
    $("#activateModal").click();
    document.getElementById("activateModal").disabled = false;
}

function loadingData(){
    $("#cnfHead").html("Loading...");
    $(".spinner").html('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');
}

$("#cancel").click(function(){
    location.reload();
});

$("#submit").click(function(){
    loadingData;
    setTimeout(getDoc_ID,7000);
});