
//Name validation ..
function checkName(name){
	var exp = /^[a-z]+$/i;
	return !exp.test(name);
}

//Date Validation

function checkDate(input_date){
	 const date = new Date(input_date);
    if(date == 'Invalid Date'){
		return true;
	}
	return false;
}


//Mobile Number
function checkMobile(mobile){
	var reg =  /^[0-9]+$/i



	if(!reg.test(mobile)  || mobile.startsWith("0") || mobile.startsWith("1") || mobile.startsWith("2") || mobile.startsWith("3")
	|| mobile.startsWith("4" || mobile.startsWith("5"))
	){
		return "Enter valid mobile number ";
	}
	if(mobile.length != 10){
		return "Exactly 10 digit number required";
	}
	
	return "";

}


//EMail

function checkMail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (false)
  }
//    alert("You have entered an invalid email address!")
    return (true)
}

function BasicDetailValidation(){
	var nextWindow = true;
	var f_name = document.getElementById("f_name");
		let l_name = document.getElementById("l_name");
		let dob = document.getElementById("dob");
		let mobile = document.getElementById("mobile");
		let tel_msg = document.getElementById("tel_msg");
		let email = document.getElementById("email");
		let mail_msg = document.getElementById("mail_msg");
		let gender = document.getElementsByName("gender");
		let gender_msg = document.getElementsByName("gender_msg");
		let nationality = document.getElementsByClassName("nationality");
		var f_name_msg = document.getElementById("f_name_msg");
		//First Name
		
		if(checkName(f_name.value)){
			nextWindow = false;
			f_name_msg.innerHTML = "Enter a valid name";
		}
		else{
			f_name_msg.innerHTML = "";
		}

		//Last Name
		var l_name_msg = document.getElementById("l_name_msg");
		if(checkName(l_name.value)){
			nextWindow = false;
			l_name_msg.innerHTML = "Enter a valid name";
		}
		else{
			l_name_msg.innerHTML = "";
		}
		//Date Of Birth
		var dob_msg = document.getElementById("dob_msg");
		
		if(checkDate(dob.value)){
			nextWindow = false;
			dob_msg.innerHTML = "Enter a valid Date";
		}
		else{
			dob_msg.innerHTML = "";
		}

		tel_msg.innerHTML = checkMobile(mobile.value);

		//Email
		
		if(checkMail(email.value)){
			nextWindow = false;
			mail_msg.innerHTML = "Enter the valid Email id";
		}
		else{
			mail_msg.innerHTML = "";
		}

		

		//Gender
		//pending
		if(!(gender[0].checked || gender[1].checked)){
			gender_msg.innerHTML="choose the gender";	
		}

	

	
	
		
		//nationality
		
		console.log(nationality[0].value)
		if((nationality[0].value) == 'select'){
			
			nextWindow = false;
		
			document.getElementById("nationality_msg").innerHTML = "select the country";
		}
		else{
			document.getElementById("nationality_msg").innerHTML = "";
		}
		if(nextWindow)
		window.location.href="course.html";
}


//Mark Validation
function checkPercentage(percentage){
	
	if(percentage ==""){
		return true;
	}
	
	if(Number.isNaN(Number(percentage))){
		return true;
	}
	else if(Number(Number(percentage)) <0 || Number(Number(percentage)) > 100){
		return true;
	}


	return false;
}


//Courses validation
function educationValidation(){

	let nextWindow = true;
	
	let hsc_school_name = document.getElementById("hsc_school_name");
	let hsc_school_name_msg = document.getElementById("hsc_school_name_msg");
	let hsc_mark = document.getElementById("hsc_school_mark");
	let total_mark_msg = document.getElementById("total_mark_msg");
	let percentage = document.getElementById("hsc_school_percentage");
	let percentage_msg = document.getElementById("percentage_msg");
	let hsc_start_date = document.getElementById("hsc_start_date");
	let start_date_msg = document.getElementById("start_date_msg");
	let hsc_end_date = document.getElementById("hsc_end_date");
	let end_date_msg = document.getElementById("end_date_msg");


	



	//let hsc_board = document.getElementById("sslc_school_name");


	if(checkName(hsc_school_name.value)){
		nextWindow = false;
		hsc_school_name_msg.innerHTML = "Enter the valid school name"
	}
	else{
		hsc_school_name_msg.innerHTML = "";
	}
	//MARK
	if(Number.isNaN(Number(hsc_mark.value)) || hsc_mark.value == "" || Number(hsc_mark.value) > 100 || Number(hsc_mark.value) < 0){
		nextWindow = false;
		total_mark_msg.innerHTML = "Enter the valid mark";
	}
	else{
		total_mark_msg.innerHTML = "";
	}
	if(checkPercentage(percentage.value)){
		nextWindow = false;
		percentage_msg.innerHTML = "Enter the valid Percentage"
	}
	else{
		percentage_msg.innerHTML = "";
	}
	if(checkDate(hsc_start_date.value)){
		nextWindow = false;
		start_date_msg.innerHTML = "Enter the valid Date";
	}
	if(checkDate(hsc_end_date.value)){
		nextWindow = false;
		end_date_msg.innerHTML = "Enter the valid Date";
	}
	else{
		end_date_msg.innerHTML = "";
	}


	//SSLC ELEMENTS
	let sslc_school_name = document.getElementById("sslc_school_name");
	let sslc_school_name_msg = document.getElementById("sslc_school_name_msg");
	let sslc_mark = document.getElementById("sslc_mark");
	let sslc_mark_msg = document.getElementById("sslc_mark_msg");
	let sslc_percentage = document.getElementById("sslc_percentage");
	let sslc_percentage_msg = document.getElementById("sslc_percentage_msg");
	let sslc_start_date = document.getElementById("sslc_start_date");
	let sslc_start_date_msg = document.getElementById("sslc_start_date_msg");
	let sslc_end_date = document.getElementById("sslc_end_date");
	let sslc_end_date_msg = document.getElementById("sslc_end_date_msg");
	

	if(checkName(sslc_school_name.value)){
		nextWindow = false;
		sslc_school_name_msg.innerHTML = "Enter the valid school name"
	}
	else{
		sslc_school_name_msg.innerHTML = "";
	}
	//MARK
	if(Number.isNaN(Number(sslc_mark.value)) || sslc_mark.value == "" || Number(sslc_mark.value) > 100 || Number(sslc_mark.value) < 0){
		nextWindow = false;
		sslc_mark_msg.innerHTML = "Enter the valid mark";
	}
	else{
		sslc_mark_msg.innerHTML = "";
	}
	if(checkPercentage(sslc_percentage.value)){
		nextWindow = false;
		sslc_percentage_msg.innerHTML = "Enter the valid Percentage"
	}
	else{
		sslc_percentage_msg.innerHTML = "";
	}
	if(checkDate(sslc_start_date.value)){
		nextWindow = false;
		sslc_start_date_msg.innerHTML = "Enter the valid Date";
	}
	else{
		sslc_start_date_msg.innerHTML="";
	}
	if(checkDate(sslc_end_date.value)){
		nextWindow = false;
		sslc_end_date_msg.innerHTML = "Enter the valid Date";
	}
	else{
		sslc_end_date_msg.innerHTML = ""
	}

	if(nextWindow) window.location.href="address.html"

}

//DoorNo
function doorNo(no){
	no = no.replaceAll("/","")
	if(Number.isNaN(Number(no)) || no == ""){
		return true;
	}
	return false;
}

function checkPincode(no){
	if(Number.isNaN(Number(no))){
		return true;
	}
	if(no.length != 6) return true;
	return false;
}


function AddressValidation(){
	
	let c_door_no = document.getElementById("c_door_no");
	let c_door_no_msg = document.getElementById("c_door_no_msg");
	let c_street = document.getElementById("c_street");
	let c_street_msg = document.getElementById("c_street_msg");
	let c_place = document.getElementById("c_place");
	let c_place_msg = document.getElementById("c_place_msg");
	let c_district = document.getElementById("c_district");
	let c_district_msg = document.getElementById("c_district_msg");
	let c_state = document.getElementById("c_state");
	let c_state_msg = document.getElementById("c_state_msg");
	let c_pincode = document.getElementById("c_pincode");
	let c_pincode_msg = document.getElementById("c_pincode_msg");
	c_door_no_msg.innerHTML = "Enter the valid Door No";
	if(doorNo(c_door_no.value)){
		c_door_no_msg.innerHTML = "Enter the valid Door No";
	}
	else{
		c_door_no_msg.innerHTML = "";
	}

	if(checkName(c_street.value)){
		c_street_msg.innerHTML = "Enter the valid Street";
	}
	else{
		c_street_msg.innerHTML = "";
	}
	if(checkName(c_place.value)){
		c_place_msg.innerHTML = "Enter the valid place";
	}
	else{
		c_place_msg.innerHTML = "";
	}
	if(checkName(c_district.value)){
		c_district_msg.innerHTML = "Enter the valid District";
	}
	else{
		c_district_msg.innerHTML = "";
	}
	if(checkName(c_state.value)){
		c_state_msg.innerHTML = "Enter the valid State";
	}
	else{
		c_state_msg.innerHTML = "";
	}

	if(checkPincode(c_pincode.value)){
		c_pincode_msg.innerHTML = "Enter the valid pincode";
	}
	else{
		c_pincode_msg.innerHTML = "";
	}

//Permanent Address Validation
let p_door_no = document.getElementById("p_door_no");
let p_door_no_msg = document.getElementById("p_door_no_msg");
let p_street = document.getElementById("p_street");
let p_street_msg = document.getElementById("p_street_msg");
let p_place = document.getElementById("p_place");
let p_place_msg = document.getElementById("p_place_msg");
let p_district = document.getElementById("p_district");
let p_district_msg = document.getElementById("p_district_msg");
let p_state = document.getElementById("p_state");
let p_state_msg = document.getElementById("p_state_msg");
let p_pincode = document.getElementById("p_pincode");
let p_pincode_msg = document.getElementById("p_pincode_msg");
p_door_no_msg.innerHTML = "Enter the valid Door No";
if(doorNo(p_door_no.value)){
	p_door_no_msg.innerHTML = "Enter the valid Door No";
}
else{
	p_door_no_msg.innerHTML = "";
}

if(checkName(p_street.value)){
	p_street_msg.innerHTML = "Enter the valid Street";
}
else{
	p_street_msg.innerHTML = "";
}
if(checkName(p_place.value)){
	p_place_msg.innerHTML = "Enter the valid place";
}
else{
	p_place_msg.innerHTML = "";
}
if(checkName(p_district.value)){
	p_district_msg.innerHTML = "Enter the valid District";
}
else{
	p_district_msg.innerHTML = "";
}
if(checkName(p_state.value)){
	p_state_msg.innerHTML = "Enter the valid State";
}
else{
	p_state_msg.innerHTML = "";
}

if(checkPincode(p_pincode.value)){
	p_pincode_msg.innerHTML = "Enter the valid pincode";
}
else{
	p_pincode_msg.innerHTML = "";
}



}