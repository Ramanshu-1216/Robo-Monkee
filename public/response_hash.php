<?php
$key=$_POST["key"];
$txnid=$_POST["txnid"];
$amount=$_POST["amount"]; //Please use the amount value from database
$productinfo=$_POST["productinfo"];
$firstname=$_POST["firstname"];
$email=$_POST["email"];
$status = $_POST["status"];
$postedhash= $_POST["hash"];
$salt="your salt key"; //Please change the value with the live salt for production environment

//hash sequence
//$responseHashSeq = $salt.'|'.$status.'|udf1|udf2|||||'.$email.'|'.$firstname.'|'.$productinfo.'|'.$amount.'|'.$txnid.'|'.$key;

$responseHashSeq = $salt.'|'.$status.'|||||||||||'.$email.'|'.$firstname.'|'.$productinfo.'|'.$amount.'|'.$txnid.'|'.$key;

$calculated_hash = hash("sha512", $responseHashSeq);
error_log("all posted variables:".print_r($_POST,true));
error_log("calculated hash:".$calculated_hash);

if($calculated_hash==$postedhash){
    error_log("transaction is valid");
}
else{
    error_log("transaction tampered");
}

echo $calculated_hash;
?>