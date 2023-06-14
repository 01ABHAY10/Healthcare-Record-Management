// signup login

$("#login-btn").click(function() {
  $("#signup-body").html( 
    `<div class="container">
    <div class="card log lscard">
    <img class=icon src="public/images/icon.png" alt="404">
    <h3 class="title"><b>HEALTHCARE RECORD</b></h3>
    <h4 class="login">Login</h4>
   
    <form action="/login" method="post">
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
    <div class="mb-3">
    <label for="exampleInputPassword1" id="pswd" class="form-label">Password</label>
    <input type="password" name="password" class="form-control" id="exampleInputPassword1" required>
  </div>
      <div class="login"><button class="btn btn-primary">Login</button></div>
      </form>
      <small class="mx-4 my-2"><b>Not a member?</b><a href="#" id="signup-btn"> <b> Sign-up</b></a></small>
  </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
    crossorigin="anonymous"></script>
  <script src="public/js/login.js"></script>
  </body>`);
    
});

if($("#signup-btn")){
  $("#signup-btn").click(function(){
    location.reload();
  });
}

//signup modal control


// if(document.getElementById('email').value != ""){
//   document.getElementById("vsgn-btn").disabled = false;
// }else{
//   document.getElementById("vsgn-btn").disabled = true;
// }