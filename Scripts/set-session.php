<?php
session_start();
$data = json_decode(file_get_contents('php://input'), true);
$_SESSION['email'] = $data['email'];
$_SESSION['userInfo'] = $data['userInfo'];
$_SESSION['verificado'] = $data['verificado'];
$_SESSION['forum'] = $data['forum'];
$_SESSION['id'] = $data['id'];
$_SESSION['infoConfig'] = $data['infoConfig'];
