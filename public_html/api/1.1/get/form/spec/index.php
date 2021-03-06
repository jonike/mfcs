<?php
include("../../../../../header.php");

ini_set('memory_limit',-1);
set_time_limit(0);

// we don't need engine's display handling here. 
$engine->obCallback = FALSE;

try {

	// ID is always passed into the API as "id" 
	// set it as "formID" that the form class expects
	http::setGet("formID",$engine->cleanGet['MYSQL']['id']);

	if (!forms::validID()) {
		throw new Exception("Invalid Form ID.");
	}

	if (($form = forms::get($engine->cleanGet['MYSQL']['id'])) === FALSE) {
		throw new Exception("error getting forms.");
	}

	$form = forms::associate_fields($form);

	$json = json_encode($form);
	print (isset($engine->cleanGet['HTML']['prettyPrint']))?json_format($json):$json;

	exit;
}
catch(Exception $e) {

	print json_encode(array("error" => "true", "message" => $e->getMessage()));

}

exit;

?>
	