<?php

//add the recipient's address here
$myemail = 'ggindiamail@yahoo.co.in';
$ccemail = 'ggindia@graphicguru.in';
//grab named inputs from html then post to #thanks
if (isset($_POST['name'])) {
$name = strip_tags($_POST['name']);
$email = strip_tags($_POST['email']);
$message = strip_tags($_POST['message']);
echo "<p class=\"alert alert-success\" >Your message has been received.  <br />Will get back to you Shortly!</p>";

 
//generate email and send!
$to = $myemail;
$email_subject = "Contact form submission: $name";
$email_body = "You have received a new message. ".
" Here are the details:\n Name: $name \n ".
"Email: $email\n Message \n $message";
$headers = "From: $myemail\n";
$headers .= "Reply-To: $email\n";
$headers .= "Cc: $ccemail";
mail($to,$email_subject,$email_body,$headers);
}
?>
