<?php

//add the recipient's address here
$myemail = 'ggindiamail@yahoo.co.in';
$ccemail = 'ggindia@graphicguru.in';
//grab named inputs from html then post to #thanks
if (isset($_POST['name'])) {
$name = strip_tags($_POST['name']);
$email = strip_tags($_POST['email']);
$message = strip_tags($_POST['message']);
$service = isset($_POST['service']) ? strip_tags($_POST['service']) : '';
$subject = isset($_POST['subject']) ? strip_tags($_POST['subject']) : '';
$phone = isset($_POST['phone']) ? strip_tags($_POST['phone']) : '';
$platform = isset($_POST['platform']) ? strip_tags($_POST['platform']) : '';
$version = isset($_POST['version']) ? strip_tags($_POST['version']) : '';
$sites = isset($_POST['sites']) ? strip_tags($_POST['sites']) : '';
$prompt = isset($_POST['prompt']) ? strip_tags($_POST['prompt']) : '';
echo "<div class=\"alert alert-success\" style=\"border:1px solid #b2dfdb;border-radius:12px;padding:20px;background:#e0f2f1;\" role=\"status\"><h3 style=\"margin-top:0;\">✓ Message sent successfully!</h3><p>Thanks <strong>$name</strong> — your message has been received.<br />We&rsquo;ll get back to you within 24 hours with an estimate in 48 hours.</p><p style=\"margin-bottom:0;\"><strong>Next:</strong> watch your inbox for a meeting invite for a free 30-minute discovery call.</p></div>";

 
//generate email and send!
$to = $myemail;
$email_subject = "Contact form submission: $name" . ($subject !== '' ? " - $subject" : '');
$email_body = "You have received a new message. ".
" Here are the details:\n Name: $name \n ".
"Email: $email\n Service: $service\n Subject: $subject\n Phone: $phone\n Platform: $platform\n Version: $version\n Sites or assets: $sites\n Prompt: $prompt\n Message \n $message";
$headers = "From: $myemail\n";
$headers .= "Reply-To: $email\n";
$headers .= "Cc: $ccemail";
mail($to,$email_subject,$email_body,$headers);
}
?>
