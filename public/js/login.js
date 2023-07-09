// signup login

$("#login-btn").click(function() {
  $("#signup-body").html( 
    `<button  disabled class="hidden">.</button>
    <div class="container">
    <div class="card log lscard">
    <img class=icon src="/images/icon.png" alt="404">
    <h3 class="title"><b>HEALTHCARE RECORD</b></h3>
    <h4 class="login">Login</h4>
   
  
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control"  name="email1" id="email1" required>
    <div class="mb-3">
    <label for="exampleInputPassword1" id="pswd" class="form-label">Password</label>
    <input type="password" name="password1" class="form-control" id="password1"  required>
  </div>
      <div class="login"><button class="btn btn-primary" id="LOGIN">Login</button></div> 
      <small class="mx-4 my-2"><b>Not a member?</b><a href="#" id="signup-btn"> <b> Sign-up</b></a></small>
  </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
    crossorigin="anonymous"></script>
  <script src="/js/login.js"></script>
  </body>`);
    
});

if($("#signup-btn")){
  $("#signup-btn").click(function(){
    location.reload();
  });
}

//signup modal control
$('#sgn-btn').click(async function() {
   if ($('#email').val() != "" && $('#password').val() != "" && $('#cnfpassword').val() != "") {
      if ($('#password').val() != $('#cnfpassword').val()) {
        alert("Password is not matched!");
      } else {
       $('#actsgnModal').click();
        await Verify();
        // Submit the form
        // $('form').submit();
      }
    }
  });



  $('#VerifySgnToken').click(async function(){
    if($('#token').val() != ""){
      await Signup_token();
    }
  });


  if($("#LOGIN")){
    $("#LOGIN").click(async function(){
        await Login();
    });
  }

//function for verify account during signin
async function Login(){
  const data = {
    email : $('#email1').val(),
    password : $('#password1').val()
  }
  const response = await fetch("http://localhost:8000/homepage",{
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  if(responseData == true){
    window.location.href = "/homepage";
  }else{
    alert("Incorrect login credentials..");
  }
}
  
//function for verify account during signup
async function Verify(){
  const data = {
    email : $('#email').val(),
    pass : $('#password').val()
  }
  const response = await fetch("http://localhost:8000/new-user",{
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  if(responseData == true){
    window.location.href = "/homepage";
  }else{
    $('#modal-content').html('<h1 class="modal-title fs-5" style="color : red">Email already exists...Try with another email</h1>');
    setTimeout(function(){
      $('#close').click();
    },3000);
  }
}

//sending signup token for verification
async function Signup_token(){
  const data = {
    value : $('#token').val(),
    email : $('#email').val(),
    pass : $('#password').val()
  }
  const response = await fetch("http://localhost:8000/new-account",{
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  if(responseData == true){
    window.location.href = "/homepage";
  }else{
    $('#modal-content').html('<h1 class="modal-title fs-5" style="color : red">Invalid Token...Retry again</h1>');
    setTimeout(function(){
      $('#close').click();
    },3000);
  }
}








