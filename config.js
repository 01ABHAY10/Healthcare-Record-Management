const mongoose = require("mongoose");

const IDschema = new mongoose.Schema({
        id : {
            type : Number,
            required : true
        },
        cid : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        }
    });

const ID = mongoose.model('ID', IDschema);

const KeySchema = new mongoose.Schema({
    key : {
        type : String,
        required : true
    }
});

const AdminKey = mongoose.model('Adminkey',KeySchema);

const UserSchema = new mongoose.Schema({
      email : {
        type:String,
        required : true
      },
      password:{
        type:String,
        required : true
      }
});

const User = mongoose.model('User',UserSchema);


const VarSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    value : {
        type : Number,
        required : true
    }
});

const Var = mongoose.model('Var',VarSchema);

module.exports = {
      MAIL_KEY : 'udyscouwzgrtgaog',
      KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ5OTQ2YkM3ZDExNzU1ZTUxRWEyQUU4OEU3RjA1YjAwYkIyN2JlNzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODAxNzIyNDU5NDcsIm5hbWUiOiJIQ1JNIn0.gDA83LOadNzAUVYV9s7H_gfFkDJBRYT85cR6cbmM49Y',
      MONGO_URL :'mongodb+srv://HealthRecord:hrm12345@records.ylhcqdm.mongodb.net/?retryWrites=true&w=majority',
      ID,
      AdminKey,
      User,
      Var
};