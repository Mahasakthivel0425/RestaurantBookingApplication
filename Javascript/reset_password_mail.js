function sendMail()
{
     var parameter={
          email: document.getElementById("email").value
     };

     const serviceID="service_mrwhnhb";
     const templateID="template_yzortum";
     emailjs.send(serviceID,templateID,parameter)
     .then(
          res =>{
               document.getElementById("email").value ="";
               console.log(res);
               alert("Your password Resetted Check your Mail");
          }
     )
     .catch((err=>console.log(err)))
     ;
}