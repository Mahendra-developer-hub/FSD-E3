<?php
session_start();

$conn = new mysqli("localhost", "root", "", "Task3_LoginSystem");

if ($conn->connect_error) {
    die("Connection failed");
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) == 1) {
    $_SESSION['username'] = $username;
    header("Location: dashboard.php");
} else {
    echo "Invalid Username or Password";
    echo "<br><a href='index.html'>Try Again</a>";
}

$conn->close();
?>
