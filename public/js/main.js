//function for fetching Doc_ID from server side
async function getDoc_ID() {
  const response = await fetch("http://localhost:8000/update");
  const Doc_ID = await response.json();
  document.getElementById("activateModal").disabled = false;
  if (Doc_ID.ID == false) {
    $("#cnf").html("Error Occured !");
  } else {
    $("#cnfHead").html("Data stored with Doc_ID :");
    $("#cnf").html(Doc_ID.ID);
  }
  $("#activateModal").click();
  document.getElementById("activateModal").disabled = false;
}

$("#cancel").click(function () {
  location.reload();
});

$("#uploadClose").click(function(){
  location.reload();
});

$("#viewClose").click(function () {
  location.reload();
});

$("#submit").click(function () {
  setTimeout(getDoc_ID, 7000);
});


//function for fetching patient data
async function getData() {
  const response = await fetch("http://localhost:8000/data");
  const data = await response.json();
  if (data && data.Doc_ID != -1) {
    $("#doc").html("Patient with Doc_ID : " + data.Doc_ID);
    $("#date").val(data.Data_Uploading_Date);
    $("#email").val(data.Email);
    $("#name").val(data.Name);
    $("#age").val(data.Age);
    $("#gender").val(data.Gender);
    $("#blood_group").val(data.Blood_Group);
    $("#height").val(data.Height);
    $("#weight").val(data.Weight);
    $("#smoke").val(data.Smoking);
    $("#drink").val(data.Drinking);
    $("#tobacco").val(data.Tobacco);
    $("#disease1").val(data.Disease_1);
    $("#disease2").val(data.Disease_2);
    $("#disease3").val(data.Disease_3);
    $("#disease4").val(data.Disease_4);
    $("#disease5").val(data.Disease_5);
    $("#disease6").val(data.Disease_6);
    $("#covid").val(data.Covid_Vaccination_Status);
    $("#other").attr("placeholder", data.Other_problems_or_symptoms);
  } else {
    alert("Error");
  }
}


//function for identifying type of error while viewing data
async function Error(num) {
  const response = await fetch("http://localhost:8000/data");
  const data = await response.json();
  if(data.Doc_ID == -1 && num == 1){
    $("#viewLabel").html(
      '<span style="color:red";>Invalid Doc_ID! ..Re-enter<span>'
    );
  }
  if(data.Doc_ID == 0 && num == 0){
    $("#viewLabel").html(
      '<span style="color:red";>Incorrect Token!..Retry<span>'
    );
  }
}


//function for identifying type of error while uploading data
async function KeyError(){
  const response = await fetch("http://localhost:8000/verify-key");
  const data = await response.json();
  if(data.key == 0){
    $('#admKeyLabel').html(
      '<span style="color:red";>Invalid Admin_Key! ..Re-enter<span>'
    );
  }
  if(data.key == -1){
    $('#admKeyLabel').html(
      '<span style="color:red";>Error occured! ..Try again<span>'
    );
  }
}

$("#verifyKey").click(function(){
  setTimeout(KeyError, 4000);
});

$("#view").click(function () {
  setTimeout(function(){
    Error(0);
  }, 5000);
});

if (window.location.href == "http://localhost:8000/view-data") {
  getData();
};


//function for requesting to generate token to server side
async function Request(){
  const docID = $('#docID').val();
  const data = {
    value : docID
  }
  console.log(docID);
  const response = await fetch("http://localhost:8000/get-token",{
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

$("#otp").click(function(){
  setTimeout(function(){
    Error(1);
  }, 4000);
  Request();
});

$(function () {
  $('[data-toggle="popover"]').popover()
})


