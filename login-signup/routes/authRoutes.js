const express=require("express");
const fs=require("fs");
const path=require("path");
const bcrypt=require("bcrypt");
const crypto=require("crypto");
const nodemailer=require("nodemailer");

const router=express.Router();

const isAuthenticated=require("../middleware/authMiddleware");

const usersPath=path.join(__dirname,"..","data","users.json");

const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"vktanwar04@gmail.com",
    pass:"jvvu tola lumh mxcp"
  }
});

router.get("/",(req,res)=>{
  res.redirect("/login");
});

router.get("/login",(req,res)=>{
  res.render("login");
});

router.post("/login",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  fs.readFile(usersPath,"utf8",(error,data)=>{
    if(error){
      return res.send("Error reading users");
    }

    let users=JSON.parse(data);

    const user=users.find((user)=>{
      return user.username===username;
    });

    if(!user){
      return res.send("Invalid username or password");
    }

    bcrypt.compare(password,user.password,(error,result)=>{
      if(error){
        return res.send("Error checking password");
      }

      if(!result){
        return res.send("Invalid username or password");
      }

      req.session.user={
        username:user.username,
        email:user.email
      };

      res.redirect("/profile");
    });
  });
});

router.get("/signup",(req,res)=>{
  res.render("signup");
});

router.post("/signup",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const email=req.body.email;

  fs.readFile(usersPath,"utf8",(error,data)=>{
    if(error){
      return res.send("Error reading users");
    }

    let users=JSON.parse(data);

    const existingUser=users.find((user)=>{
      return user.username===username||user.email===email;
    });

    if(existingUser){
      return res.send("Username or email already exists");
    }

    bcrypt.hash(password,10,(error,hash)=>{
      if(error){
        return res.send("Error hashing password");
      }

      const newUser={
        username:username,
        email:email,
        password:hash
      };

      users.push(newUser);

      fs.writeFile(
        usersPath,
        JSON.stringify(users,null,2),
        (error)=>{
          if(error){
            return res.send("Error saving user");
          }
          res.redirect("/login");
        }
      );
    });
  });
});

router.get("/profile",isAuthenticated,(req,res)=>{
  res.render("profile",{
    user:req.session.user
  });
});

router.get("/forgot-password",(req,res)=>{
  res.render("forgot-password");
});

router.post("/forgot-password",(req,res)=>{
  const email=req.body.email;

  fs.readFile(usersPath,"utf8",(error,data)=>{
    if(error){
      return res.send("Error reading users");
    }

    let users=JSON.parse(data);

    const user=users.find((user)=>{
      return user.email===email;
    });

    if(!user){
      return res.send("No account found with this email");
    }

    const resetToken=crypto.randomBytes(32).toString("hex");

    user.resetToken=resetToken;

    fs.writeFile(
      usersPath,
      JSON.stringify(users,null,2),
      (error)=>{
        if(error){
          return res.send("Error saving reset token");
        }

        const resetLink=`http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions={
          from:"vktanwar04@gmail.com",
          to:user.email,
          subject:"Password Reset",
          text:`Hello ${user.username},\n\n`+
               `Click the following link to reset your password:\n\n`+
               `${resetLink}\n\n`+
               `If you did not request this, ignore this email.`
        };

        transporter.sendMail(
          mailOptions,
          (error,info)=>{
            if(error){
              console.log(error);
              return res.send("Error sending email");
            }

            console.log("Email sent:",info.response);

            res.send("Password reset link has been sent to your email");
          }
        );
      }
    );
  });
});

router.get("/reset-password/:token",(req,res)=>{
  const token=req.params.token;

  fs.readFile(usersPath,"utf8",(error,data)=>{
    if(error){
      return res.send("Error reading users");
    }

    let users=JSON.parse(data);

    const user=users.find((user)=>{
      return user.resetToken===token;
    });

    if(!user){
      return res.send("Invalid reset token");
    }

    res.render("reset-password",{
      token:token
    });
  });
});

router.post("/reset-password/:token",(req,res)=>{
  const token=req.params.token;
  const newPassword=req.body.password;

  fs.readFile(usersPath,"utf8",(error,data)=>{
    if(error){
      return res.send("Error reading users");
    }

    let users=JSON.parse(data);

    const user=users.find((user)=>{
      return user.resetToken===token;
    });

    if(!user){
      return res.send("Invalid reset token");
    }

    bcrypt.hash(newPassword,10,(error,hash)=>{
      if(error){
        return res.send("Error hashing password");
      }

      user.password=hash;

      delete user.resetToken;

      fs.writeFile(
        usersPath,
        JSON.stringify(users,null,2),
        (error)=>{
          if(error){
            return res.send("Error updating password");
          }

          res.redirect("/login");
        }
      );
    });
  });
});

router.get("/logout",(req,res)=>{
  req.session.destroy((error)=>{
    if(error){
      return res.send("Error logging out");
    }

    res.redirect("/login");
  });
});

module.exports=router;