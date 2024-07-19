function sendMail()
{
     var parameter={
          name: document.getElementById("name").value ,
          email: document.getElementById("email").value ,
          message: document.getElementById("message").value
     };

     const serviceID="service_mrwhnhb";
     const templateID="template_h8cg8ac";
     emailjs.send(serviceID,templateID,parameter)
     .then(
          res =>{
               document.getElementById("name").value ="";
               document.getElementById("email").value ="";
               document.getElementById("message").value ="";
               console.log(res);
               alert("Your message sent successfully");
          }
     )
     .catch((err=>console.log(err)))
     ;
}