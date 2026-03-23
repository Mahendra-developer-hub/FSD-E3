<?php
$conn = new mysqli("localhost", "root", "", "Task1_StudentRegistration");

if ($conn->connect_error) {
    die("Connection failed");
}

$name = $_POST['name'];
$email = $_POST['email'];
$dob = $_POST['dob'];
$department = $_POST['department'];
$phone = $_POST['phone'];

$sql = "INSERT INTO student (name, email, dob, department, phone)
        VALUES ('$name', '$email', '$dob', '$department', '$phone')";

if ($conn->query($sql) === TRUE) {
    echo "Student Registered Successfully <br><br>";
    echo "<a href='display.php'>View Students</a>";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
